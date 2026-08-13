FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/matching-service-1.0.0.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
