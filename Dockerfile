FROM gradle:8.7-jdk17

WORKDIR /app

COPY . .

RUN gradle clean build -x test

EXPOSE 8080

CMD ["java", "-jar", "build/libs/livro-caixa-0.0.1-SNAPSHOT.jar"]