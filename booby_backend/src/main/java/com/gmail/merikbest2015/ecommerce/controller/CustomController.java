package com.gmail.merikbest2015.ecommerce.controller;

import com.gmail.merikbest2015.ecommerce.service.DatabaseService;
import com.gmail.merikbest2015.ecommerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class CustomController {

    @Autowired
    private DatabaseService dbService;

    private void appendTokenIfUser(Map<String, Object> user) {
        if (user == null) return;
        String id = user.getOrDefault("id", "").toString();
        String role = user.getOrDefault("role", "user").toString();
        String phone = user.getOrDefault("phone", "").toString();
        String token = JwtUtil.generateToken(id, role, phone);
        user.put("token", token);
    }

    private Map<String, Object> getAuthClaims(String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            return null;
        }
        return JwtUtil.getClaims(authHeader);
    }

    // --- USERS ENDPOINTS ---
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestParam(required = false) String phone,
                                      @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);
        List<Map<String, Object>> users = dbService.getList("users");

        // Strong Security: Enforce that regular users can only see their own profile
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();

            if (!"admin".equalsIgnoreCase(role)) {
                List<Map<String, Object>> self = users.stream()
                        .filter(u -> loggedInUserId.equals(u.get("id") != null ? u.get("id").toString() : null))
                        .collect(Collectors.toList());
                self.forEach(this::appendTokenIfUser);
                return ResponseEntity.ok(self);
            }
        }

        if (phone != null && !phone.trim().isEmpty()) {
            List<Map<String, Object>> filtered = users.stream()
                    .filter(u -> phone.equals(u.get("phone")))
                    .collect(Collectors.toList());
            filtered.forEach(this::appendTokenIfUser);
            return ResponseEntity.ok(filtered);
        }
        users.forEach(this::appendTokenIfUser);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Users can only retrieve their own profile details
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();

            if (!"admin".equalsIgnoreCase(role) && !loggedInUserId.equals(id)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. You can only view your own profile."));
            }
        }

        List<Map<String, Object>> users = dbService.getList("users");
        for (Map<String, Object> user : users) {
            if (id.equals(user.get("id").toString())) {
                appendTokenIfUser(user);
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/users")
    public Map<String, Object> createUser(@RequestBody Map<String, Object> user) {
        Map<String, Object> created = dbService.add("users", user);
        appendTokenIfUser(created);
        return created;
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, 
                                        @RequestBody Map<String, Object> user,
                                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Users can only modify their own profile details
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();

            if (!"admin".equalsIgnoreCase(role) && !loggedInUserId.equals(id)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. You can only modify your own profile."));
            }
        }

        Map<String, Object> updated = dbService.update("users", id, user);
        if (updated != null) {
            appendTokenIfUser(updated);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<?> patchUser(@PathVariable String id, 
                                       @RequestBody Map<String, Object> partialUser,
                                       @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Users can only partially modify their own profile details
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();

            if (!"admin".equalsIgnoreCase(role) && !loggedInUserId.equals(id)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. You can only modify your own profile."));
            }
        }

        Map<String, Object> updated = dbService.update("users", id, partialUser);
        if (updated != null) {
            appendTokenIfUser(updated);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id,
                                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Users can only delete their own profile details
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();

            if (!"admin".equalsIgnoreCase(role) && !loggedInUserId.equals(id)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. You can only delete your own profile."));
            }
        }

        boolean deleted = dbService.delete("users", id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- PRODUCTS ENDPOINTS ---
    @GetMapping("/products")
    public List<Map<String, Object>> getProducts() {
        return dbService.getList("products");
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        List<Map<String, Object>> products = dbService.getList("products");
        for (Map<String, Object> product : products) {
            if (id.equals(product.get("id").toString())) {
                return ResponseEntity.ok(product);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Map<String, Object> product,
                                           @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Only administrators can create products
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. Only administrators can perform this action."));
            }
        }

        return ResponseEntity.ok(dbService.add("products", product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, 
                                           @RequestBody Map<String, Object> product,
                                           @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Only administrators can fully update products
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. Only administrators can perform this action."));
            }
        }

        Map<String, Object> updated = dbService.update("products", id, product);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/products/{id}")
    public ResponseEntity<?> patchProduct(@PathVariable String id, 
                                          @RequestBody Map<String, Object> partialProduct,
                                          @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Only administrators can partially update products
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. Only administrators can perform this action."));
            }
        }

        Map<String, Object> updated = dbService.update("products", id, partialProduct);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id,
                                           @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Only administrators can delete products
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            if (!"admin".equalsIgnoreCase(role)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. Only administrators can perform this action."));
            }
        }

        boolean deleted = dbService.delete("products", id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- ORDERS ENDPOINTS ---
    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@RequestParam(required = false) String userId,
                                       @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);
        List<Map<String, Object>> orders = dbService.getList("orders");

        // Strong Security: Enforce that regular users can only retrieve their own orders
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();

            if (!"admin".equalsIgnoreCase(role)) {
                List<Map<String, Object>> userOrders = orders.stream()
                        .filter(o -> loggedInUserId.equals(o.get("userId") != null ? o.get("userId").toString() : null))
                        .collect(Collectors.toList());
                return ResponseEntity.ok(userOrders);
            }
        }

        if (userId != null && !userId.trim().isEmpty()) {
            List<Map<String, Object>> filtered = orders.stream()
                    .filter(o -> userId.equals(o.get("userId") != null ? o.get("userId").toString() : null))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(filtered);
        }
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> order,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Ensure user only creates an order for themselves
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();
            String orderUserId = order.getOrDefault("userId", "").toString();

            if (!"admin".equalsIgnoreCase(role) && !loggedInUserId.equals(orderUserId)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. You cannot place orders for other users."));
            }
        }

        return ResponseEntity.ok(dbService.add("orders", order));
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable String id, 
                                         @RequestBody Map<String, Object> order,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Only admin or the order owner can modify order details
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();
            String orderUserId = order.getOrDefault("userId", "").toString();

            if (!"admin".equalsIgnoreCase(role) && !loggedInUserId.equals(orderUserId)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. You cannot modify other users' orders."));
            }
        }

        Map<String, Object> updated = dbService.update("orders", id, order);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/orders/{id}")
    public ResponseEntity<?> patchOrder(@PathVariable String id, 
                                        @RequestBody Map<String, Object> partialOrder,
                                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Only admin or the order owner can modify order details
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();
            String orderUserId = partialOrder.getOrDefault("userId", "").toString();

            if (!"admin".equalsIgnoreCase(role) && !orderUserId.isEmpty() && !loggedInUserId.equals(orderUserId)) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. You cannot modify other users' orders."));
            }
        }

        Map<String, Object> updated = dbService.update("orders", id, partialOrder);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable String id,
                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> claims = getAuthClaims(authHeader);

        // Strong Security: Only admin or the order owner can delete order details
        if (claims != null) {
            String role = claims.getOrDefault("role", "user").toString();
            String loggedInUserId = claims.getOrDefault("id", "").toString();

            List<Map<String, Object>> orders = dbService.getList("orders");
            boolean ownsOrder = false;
            for (Map<String, Object> order : orders) {
                if (id.equals(order.get("id").toString()) && loggedInUserId.equals(order.getOrDefault("userId", "").toString())) {
                    ownsOrder = true;
                    break;
                }
            }

            if (!"admin".equalsIgnoreCase(role) && !ownsOrder) {
                return ResponseEntity.status(403).body(Collections.singletonMap("error", "Access denied. You cannot delete other users' orders."));
            }
        }

        boolean deleted = dbService.delete("orders", id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- ADDRESSES ENDPOINTS ---
    @GetMapping("/addresses")
    public List<Map<String, Object>> getAddresses(@RequestParam(required = false) String userId) {
        List<Map<String, Object>> addresses = dbService.getList("addresses");
        if (userId != null && !userId.trim().isEmpty()) {
            return addresses.stream()
                    .filter(a -> userId.equals(a.get("userId") != null ? a.get("userId").toString() : null))
                    .collect(Collectors.toList());
        }
        return addresses;
    }

    @PostMapping("/addresses")
    public Map<String, Object> createAddress(@RequestBody Map<String, Object> address) {
        return dbService.add("addresses", address);
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<Map<String, Object>> updateAddress(@PathVariable String id, @RequestBody Map<String, Object> address) {
        Map<String, Object> updated = dbService.update("addresses", id, address);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/addresses/{id}")
    public ResponseEntity<Map<String, Object>> patchAddress(@PathVariable String id, @RequestBody Map<String, Object> partialAddress) {
        Map<String, Object> updated = dbService.update("addresses", id, partialAddress);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable String id) {
        boolean deleted = dbService.delete("addresses", id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- WISHLIST ENDPOINTS ---
    @GetMapping("/wishlist")
    public List<Map<String, Object>> getWishlist(@RequestParam(required = false) String userId) {
        List<Map<String, Object>> wishlist = dbService.getList("wishlist");
        if (userId != null && !userId.trim().isEmpty()) {
            return wishlist.stream()
                    .filter(w -> userId.equals(w.get("userId") != null ? w.get("userId").toString() : null))
                    .collect(Collectors.toList());
        }
        return wishlist;
    }

    @PostMapping("/wishlist")
    public Map<String, Object> createWishlistItem(@RequestBody Map<String, Object> wishlistItem) {
        return dbService.add("wishlist", wishlistItem);
    }

    @DeleteMapping("/wishlist/{id}")
    public ResponseEntity<Void> deleteWishlistItem(@PathVariable String id) {
        boolean deleted = dbService.delete("wishlist", id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- REVIEWS ENDPOINTS ---
    @GetMapping("/reviews")
    public List<Map<String, Object>> getReviews(@RequestParam(required = false) String productId) {
        List<Map<String, Object>> reviews = dbService.getList("reviews");
        if (productId != null && !productId.trim().isEmpty() && !"null".equalsIgnoreCase(productId)) {
            return reviews.stream()
                    .filter(r -> productId.equals(r.get("productId") != null ? r.get("productId").toString() : null))
                    .collect(Collectors.toList());
        }
        return reviews;
    }

    @PostMapping("/reviews")
    public Map<String, Object> createReview(@RequestBody Map<String, Object> review) {
        return dbService.add("reviews", review);
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<Map<String, Object>> updateReview(@PathVariable String id, @RequestBody Map<String, Object> review) {
        Map<String, Object> updated = dbService.update("reviews", id, review);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/reviews/{id}")
    public ResponseEntity<Map<String, Object>> patchReview(@PathVariable String id, @RequestBody Map<String, Object> partialReview) {
        Map<String, Object> updated = dbService.update("reviews", id, partialReview);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        boolean deleted = dbService.delete("reviews", id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- USER REVIEWS (TESTIMONIALS) ENDPOINTS ---
    @GetMapping("/userReviews")
    public List<Map<String, Object>> getUserReviews() {
        return dbService.getList("userReviews");
    }

    @PostMapping("/userReviews")
    public Map<String, Object> createUserReview(@RequestBody Map<String, Object> userReview) {
        return dbService.add("userReviews", userReview);
    }

    // --- SERVER HEALTH CHECK ---
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("databasePath", dbService.getResolvedDbPath());
        
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> jvm = new LinkedHashMap<>();
        jvm.put("freeMemory", runtime.freeMemory() / (1024 * 1024) + " MB");
        jvm.put("totalMemory", runtime.totalMemory() / (1024 * 1024) + " MB");
        jvm.put("maxMemory", runtime.maxMemory() / (1024 * 1024) + " MB");
        jvm.put("availableProcessors", runtime.availableProcessors());
        health.put("jvm", jvm);
        
        health.put("timestamp", new Date().toString());
        return ResponseEntity.ok(health);
    }
}
