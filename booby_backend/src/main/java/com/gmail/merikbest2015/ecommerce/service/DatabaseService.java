package com.gmail.merikbest2015.ecommerce.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Service
public class DatabaseService {
    private static final Logger log = LoggerFactory.getLogger(DatabaseService.class);
    private final ObjectMapper mapper = new ObjectMapper();
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    
    private String resolvedDbPath;
    private Map<String, Object> data = new HashMap<>();

    @PostConstruct
    public void init() {
        // High-portability path resolution
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
                resolvedDbPath = f.getAbsolutePath();
                break;
            }
        }

        if (file == null) {
            // Fallback to default path if none exists
            resolvedDbPath = potentialPaths[0];
            file = new File(resolvedDbPath);
            log.warn("db.json was not found in any potential paths. Defaulting to: {}", resolvedDbPath);
        } else {
            log.info("Successfully resolved db.json database path at: {}", resolvedDbPath);
        }

        lock.writeLock().lock();
        try {
            if (file.exists()) {
                data = mapper.readValue(file, new TypeReference<Map<String, Object>>() {});
                log.info("Database loaded successfully. Records count - Users: {}, Products: {}, Orders: {}, Addresses: {}", 
                    getList("users").size(), getList("products").size(), getList("orders").size(), getList("addresses").size());
            } else {
                initializeDefaultData();
            }
        } catch (Exception e) {
            log.error("Failed to load db.json, initializing empty datastore", e);
            initializeDefaultData();
        } finally {
            lock.writeLock().unlock();
        }
    }

    private void initializeDefaultData() {
        data.put("users", new ArrayList<>());
        data.put("products", new ArrayList<>());
        data.put("orders", new ArrayList<>());
        data.put("addresses", new ArrayList<>());
        data.put("wishlist", new ArrayList<>());
        data.put("reviews", new ArrayList<>());
        data.put("userReviews", new ArrayList<>());
    }

    private void performBackup() {
        try {
            File src = new File(resolvedDbPath);
            if (!src.exists()) return;

            File backupDir = new File(src.getParent(), "backups");
            if (!backupDir.exists()) {
                backupDir.mkdirs();
            }

            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            File dest = new File(backupDir, "db_backup_" + timestamp + ".json");
            Files.copy(src.toPath(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING);

            // Maintain rolling backups of last 5 copies
            File[] files = backupDir.listFiles((dir, name) -> name.startsWith("db_backup_") && name.endsWith(".json"));
            if (files != null && files.length > 5) {
                Arrays.sort(files, Comparator.comparingLong(File::lastModified));
                for (int i = 0; i < files.length - 5; i++) {
                    files[i].delete();
                }
            }
        } catch (Exception e) {
            log.error("Failed to perform database backup", e);
        }
    }

    public void save() {
        lock.writeLock().lock();
        try {
            // Perform rolling backup before writing to ensure durability
            performBackup();
            
            File file = new File(resolvedDbPath);
            // Ensure parent directories exist
            if (file.getParentFile() != null && !file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            mapper.writerWithDefaultPrettyPrinter().writeValue(file, data);
            log.info("Database changes successfully persisted to disk.");
        } catch (Exception e) {
            log.error("Failed to persist database changes to disk!", e);
        } finally {
            lock.writeLock().unlock();
        }
    }

    @PreDestroy
    public void shutdown() {
        log.info("Spring Boot shutting down. Executing graceful persistence flush...");
        save();
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getList(String key) {
        lock.readLock().lock();
        try {
            if (!data.containsKey(key)) {
                return new ArrayList<>();
            }
            return (List<Map<String, Object>>) data.get(key);
        } finally {
            lock.readLock().unlock();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> add(String key, Map<String, Object> item) {
        lock.writeLock().lock();
        try {
            if (!data.containsKey(key)) {
                data.put(key, new ArrayList<>());
            }
            List<Map<String, Object>> list = (List<Map<String, Object>>) data.get(key);
            if (!item.containsKey("id") || item.get("id") == null || item.get("id").toString().isEmpty()) {
                item.put("id", UUID.randomUUID().toString().substring(0, 8));
            }
            list.add(item);
            save();
            return item;
        } finally {
            lock.writeLock().unlock();
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> update(String key, String id, Map<String, Object> updatedItem) {
        lock.writeLock().lock();
        try {
            if (!data.containsKey(key)) return null;
            List<Map<String, Object>> list = (List<Map<String, Object>>) data.get(key);
            for (int i = 0; i < list.size(); i++) {
                Map<String, Object> current = list.get(i);
                if (id.equals(current.get("id").toString())) {
                    current.putAll(updatedItem);
                    current.put("id", id);
                    save();
                    return current;
                }
            }
            return null;
        } finally {
            lock.writeLock().unlock();
        }
    }

    @SuppressWarnings("unchecked")
    public boolean delete(String key, String id) {
        lock.writeLock().lock();
        try {
            if (!data.containsKey(key)) return false;
            List<Map<String, Object>> list = (List<Map<String, Object>>) data.get(key);
            boolean removed = list.removeIf(item -> id.equals(item.get("id").toString()));
            if (removed) {
                save();
            }
            return removed;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public String getResolvedDbPath() {
        return resolvedDbPath;
    }
}
