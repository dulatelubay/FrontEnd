FROM eclipse-temurin:21-jdk-jammy

# Install Python + Docker CLI
RUN apt-get update && \
    apt-get install -y python3 curl && \
    curl -fsSL https://get.docker.com | sh && \
    apt-get clean

WORKDIR /app

COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]