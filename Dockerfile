FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew

# 🔥 força usar a versão correta do Gradle
RUN ./gradlew clean build -x test --no-daemon

EXPOSE 8080

CMD ["java", "-jar", "build/libs/livro-caixa-0.0.1-SNAPSHOT.jar"]