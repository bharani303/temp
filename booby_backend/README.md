# 🛋️ Homie Furniture Rentals - Spring Boot MongoDB Backend

This is the backend REST API server for the **Homie Furniture Rentals** web application. Originally relying on an in-memory flat-file database, it has been modernized to use a dynamic, persistent **MongoDB** datastore.

---

## 🚀 Key Features

* **High Performance MongoDB Storage**: Powered by Spring Data MongoDB (`MongoTemplate`) for persistent, real-time database CRUD operations.
* **Automatic JSON-to-Mongo Migration**: On first startup, the backend automatically detects if your MongoDB database is empty, locates your existing `db.json` file, and migrates all seed data (Users, Products, Orders, Addresses, Wishlist, Reviews) into MongoDB collections.
* **Security & Authorization**: Custom stateless JWT authentication middleware (`JwtUtil.java`) with role-based checks (Admin vs. User) and IDOR route protection.
* **Advanced Logging**: Full HTTP request/response payload caching and structured console logging (`RequestLoggingFilter.java`).
* **Self-Healing IDs**: Automatic conversion between MongoDB's default `_id` field and the frontend's expected `id` string (and vice-versa) preventing schema compilation or JSON serialization errors.
* **Diagnostic Health Checks**: Endpoint `/health` reporting database status, system time, and JVM memory utilization.

---

## 🛠️ Tech Stack

* **Framework**: Spring Boot (v2.3.6.RELEASE)
* **Java Version**: Java 8 / Java 23 compatible
* **Database**: MongoDB (via `spring-boot-starter-data-mongodb`)
* **Security**: Spring Security & Custom HMAC-SHA256 JWT validation
* **API Documentation**: Swagger UI integrated

---

## ⚙️ Configuration & Environment Variables

You can run the application out-of-the-box or point it to a remote/cloud MongoDB instance using the following environment variable:

* **`MONGO_URI`**: The MongoDB Connection URI.
  * *Default Fallback*: `mongodb://localhost:27017/booby`

Inside `src/main/resources/application.properties`:
```properties
server.port=5000
spring.data.mongodb.uri=${MONGO_URI:mongodb://localhost:27017/booby}
```

---

## 🏃 Getting Started

### 1. Prerequisites
- Install **Java JDK 8** or higher (Java 23 recommended).
- Ensure a local instance of **MongoDB** is running on your machine:
  ```powershell
  # Check if port 27017 is listening
  Get-NetTCPConnection -LocalPort 27017
  ```

### 2. Compile the Project
Using the Maven Wrapper:
```powershell
# Set JAVA_HOME path if needed
$env:JAVA_HOME="C:\Program Files\Java\jdk-23"
.\mvnw.cmd clean compile
```

### 3. Run Tests
Ensure all unit/integration tests compile and pass successfully:
```powershell
.\mvnw.cmd test
```

### 4. Run the Backend Server
Start the server locally on port `5000`:
```powershell
.\mvnw.cmd spring-boot:run
```

---

## 📂 Core API Endpoints

### 🔐 Auth & Users
- `GET /users` — Get all users (Admin only) or current profile (User).
- `GET /users/{id}` — Get detailed user profile by ID.
- `POST /users` — Register a new user profile (returns dynamic JWT).
- `PUT /users/{id}` / `PATCH /users/{id}` — Update profile.
- `DELETE /users/{id}` — Permanently delete user.

### 🛋️ Catalog Products
- `GET /products` — Retrieve all catalog furniture items (Public).
- `GET /products/{id}` — Retrieve details of a product (Public).
- `POST /products` / `PUT /products/{id}` / `DELETE /products/{id}` — Catalog management (Admin only).

### 🛒 Orders & Transactions
- `GET /orders` — List orders (Admin views all; User views own).
- `POST /orders` — Place a new furniture rental order.
- `PUT /orders/{id}` / `PATCH /orders/{id}` — Edit order status (e.g. pending to active).
- `DELETE /orders/{id}` — Cancel/remove order.

### 📍 Auxiliary Services
- `GET /addresses` / `POST /addresses` — Manage user shipping/billing addresses.
- `GET /wishlist` / `POST /wishlist` — Manage user personal product wishlists.
- `GET /reviews` / `POST /reviews` — Retrieve/post reviews on products.
- `GET /health` — Diagnostic server health check.
