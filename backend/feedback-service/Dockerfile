FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/feedback-service-1.0.0.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
