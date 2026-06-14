# Multi-stage build for Spring Boot Maven application

# Stage 1: Build the application
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and fetch dependencies (to optimize Docker build caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Create the production image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render assigns a port dynamically using the PORT environment variable
ENV PORT=5000
EXPOSE 5000

# Run the jar, dynamically setting the server port
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
