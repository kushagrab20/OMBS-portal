FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY backend/ ./
RUN mvn package -pl eureka-server -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/eureka-server/target/eureka-server-1.0.0.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
