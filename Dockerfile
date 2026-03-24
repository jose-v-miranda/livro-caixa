FROM gradle:8.7-jdk17

WORKDIR /app

COPY . .

RUN gradle clean build -x test

EXPOSE 8080

CMD ["sh", "-c", "java -jar build/libs/*.jar"]