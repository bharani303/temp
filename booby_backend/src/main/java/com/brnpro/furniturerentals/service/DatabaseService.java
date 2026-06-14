/*
 * Developed by brnpro
 */
package com.brnpro.furniturerentals.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.util.*;

@Service
public class DatabaseService {
    private static final Logger log = LoggerFactory.getLogger(DatabaseService.class);
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private MongoTemplate mongoTemplate;

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @PostConstruct
    public void init() {
        log.info("Initializing DatabaseService with MongoDB. URI: {}", mongoUri);
        try {
            // Check if the database is empty or doesn't have products/users, then perform migration
            boolean collectionsEmpty = mongoTemplate.getCollectionNames().isEmpty() || 
                                        mongoTemplate.findAll(Map.class, "products").isEmpty();
            if (collectionsEmpty) {
                migrateJsonToMongo();
            } else {
                log.info("MongoDB already contains data. Skipping migration.");
            }
        } catch (Exception e) {
            log.error("Failed to execute database migration check", e);
        }
    }

    private void migrateJsonToMongo() {
        String[] potentialPaths = {
            "c:\\Users\\Bharanidharan\\Desktop\\booby\\booby_fronted\\db.json",
            "../booby_fronted/db.json",
            "./booby_fronted/db.json",
            "./db.json",
            "db.json"
        };

        File file = null;
        for (String path : potentialPaths) {
            File f = new File(path);
            if (f.exists()) {
                file = f;
                break;
            }
        }

        if (file == null || !file.exists()) {
            log.warn("No db.json found for initial MongoDB migration.");
            return;
        }

        log.info("Found db.json at {}. Migrating data to MongoDB...", file.getAbsolutePath());
        try {
            Map<String, List<Map<String, Object>>> jsonDb = mapper.readValue(
                file, 
                new TypeReference<Map<String, List<Map<String, Object>>>>() {}
            );
            
            for (Map.Entry<String, List<Map<String, Object>>> entry : jsonDb.entrySet()) {
                String collectionName = entry.getKey();
                List<Map<String, Object>> list = entry.getValue();
                if (list != null && !list.isEmpty()) {
                    log.info("Migrating {} documents to collection '{}'", list.size(), collectionName);
                    for (Map<String, Object> item : list) {
                        if (!item.containsKey("id") || item.get("id") == null || item.get("id").toString().isEmpty()) {
                            item.put("id", UUID.randomUUID().toString().substring(0, 8));
                        }
                        Map<String, Object> prep = prepareMongoDoc(item);
                        mongoTemplate.save(prep, collectionName);
                    }
                }
            }
            log.info("Migration from db.json to MongoDB completed successfully.");
        } catch (Exception e) {
            log.error("Error migrating db.json to MongoDB", e);
        }
    }

    public void save() {
        // No-op for MongoDB as changes are persistent in real time
    }

    @PreDestroy
    public void shutdown() {
        log.info("Spring Boot shutting down gracefully.");
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getList(String key) {
        try {
            List<Map> rawList = mongoTemplate.findAll(Map.class, key);
            List<Map<String, Object>> result = new ArrayList<>();
            for (Map raw : rawList) {
                result.add(cleanMongoDoc((Map<String, Object>) raw));
            }
            return result;
        } catch (Exception e) {
            log.error("Failed to retrieve list from MongoDB collection: {}", key, e);
            return new ArrayList<>();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> add(String key, Map<String, Object> item) {
        try {
            if (!item.containsKey("id") || item.get("id") == null || item.get("id").toString().isEmpty()) {
                item.put("id", UUID.randomUUID().toString().substring(0, 8));
            }
            Map<String, Object> prep = prepareMongoDoc(item);
            mongoTemplate.save(prep, key);
            return cleanMongoDoc(prep);
        } catch (Exception e) {
            log.error("Failed to insert document into MongoDB collection: {}", key, e);
            return item;
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> update(String key, String id, Map<String, Object> updatedItem) {
        try {
            // Find existing by ID
            Query query = new Query(Criteria.where("_id").is(id));
            Map<String, Object> existing = mongoTemplate.findOne(query, Map.class, key);
            
            if (existing == null) {
                // Fallback search by "id" field
                Query queryById = new Query(Criteria.where("id").is(id));
                existing = mongoTemplate.findOne(queryById, Map.class, key);
            }

            if (existing != null) {
                existing.putAll(updatedItem);
                existing.put("id", id);
                Map<String, Object> prep = prepareMongoDoc(existing);
                mongoTemplate.save(prep, key);
                return cleanMongoDoc(prep);
            }
            return null;
        } catch (Exception e) {
            log.error("Failed to update document in MongoDB collection: {}, ID: {}", key, id, e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public boolean delete(String key, String id) {
        try {
            Query query = new Query(Criteria.where("_id").is(id));
            Map<?, ?> deleted = mongoTemplate.findAndRemove(query, Map.class, key);
            if (deleted == null) {
                Query queryById = new Query(Criteria.where("id").is(id));
                deleted = mongoTemplate.findAndRemove(queryById, Map.class, key);
            }
            return deleted != null;
        } catch (Exception e) {
            log.error("Failed to delete document from MongoDB collection: {}, ID: {}", key, id, e);
            return false;
        }
    }

    public String getResolvedDbPath() {
        return mongoUri != null ? mongoUri : "mongodb://localhost:27017/booby";
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> cleanMongoDoc(Map<String, Object> doc) {
        if (doc == null) return null;
        Map<String, Object> clean = new LinkedHashMap<>(doc);
        if (clean.containsKey("_id")) {
            Object idObj = clean.get("_id");
            if (idObj != null) {
                clean.put("id", idObj.toString());
            }
            clean.remove("_id");
        }
        
        for (Map.Entry<String, Object> entry : clean.entrySet()) {
            if (entry.getValue() instanceof Map) {
                entry.setValue(cleanMongoDoc((Map<String, Object>) entry.getValue()));
            } else if (entry.getValue() instanceof List) {
                List<?> list = (List<?>) entry.getValue();
                List<Object> cleanedList = new ArrayList<>();
                for (Object elem : list) {
                    if (elem instanceof Map) {
                        cleanedList.add(cleanMongoDoc((Map<String, Object>) elem));
                    } else {
                        cleanedList.add(elem);
                    }
                }
                entry.setValue(cleanedList);
            }
        }
        return clean;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> prepareMongoDoc(Map<String, Object> doc) {
        if (doc == null) return null;
        Map<String, Object> prep = new LinkedHashMap<>(doc);
        Object idVal = prep.get("id");
        if (idVal != null) {
            prep.put("_id", idVal.toString());
        }
        
        for (Map.Entry<String, Object> entry : prep.entrySet()) {
            if (entry.getValue() instanceof Map) {
                entry.setValue(prepareMongoDoc((Map<String, Object>) entry.getValue()));
            } else if (entry.getValue() instanceof List) {
                List<?> list = (List<?>) entry.getValue();
                List<Object> preppedList = new ArrayList<>();
                for (Object elem : list) {
                    if (elem instanceof Map) {
                        preppedList.add(prepareMongoDoc((Map<String, Object>) elem));
                    } else {
                        preppedList.add(elem);
                    }
                }
                entry.setValue(preppedList);
            }
        }
        return prep;
    }
}
