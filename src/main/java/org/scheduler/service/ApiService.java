package org.scheduler.service;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.io.IOException;
import java.time.Duration;

import io.github.cdimascio.dotenv.Dotenv;

public class ApiService {
    private HttpClient client;
    private String apiURL;
    private String apiKey;

    public ApiService() {
        Dotenv dotenv = Dotenv.load();
        this.apiURL = dotenv.get("API_URL");
        this.apiKey = dotenv.get("X_API_KEY");
        this.client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(15))
        .build();
    }

    public String sendMessage(String message, String phoneNumber, String dateTime) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiURL))
                .POST(HttpRequest.BodyPublishers.ofString(message))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();
        return responseBody;
    }

    public String login(String userId) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiURL + "session/start/" + userId))
                .headers("x-api-key", apiKey, "accept",  "application/json")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();
        return responseBody;
    }

    public byte[] qrCode(String userId) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiURL + "session/qr/" + userId + "/image"))
                .headers("x-api-key", apiKey, "accept", "image/png")
                .GET()
                .build();
        HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
        return response.body();
    }

    public String status(String userId) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiURL + "session/status/" + userId))
                .headers("x-api-key", apiKey, "accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();
        System.out.println("ApiService STATUS: " + responseBody);
        return responseBody;
    }
}