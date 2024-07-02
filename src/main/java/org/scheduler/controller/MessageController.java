package org.scheduler.controller;

import org.scheduler.model.MessageForm;
import org.scheduler.service.ApiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class MessageController {
    private final ApiService apiService;

    public MessageController() {
        this.apiService = new ApiService();
    }

    @PostMapping("/send-message")
    public void sendMessage(@RequestBody MessageForm messageForm) {
        try {
            String message = apiService.sendMessage(messageForm.getMessage(), messageForm.getContactNumber(), messageForm.getDateTime());
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    @GetMapping(value = "/qr-code/{userId}/image", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(@PathVariable String userId) {
        System.out.println("QR CODE userId = " + userId);
        try {
            byte[] imageBytes = apiService.qrCode(userId);
            return ResponseEntity.ok().body(imageBytes);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{userId}")
    public String getStatus(@PathVariable String userId) {
        try {
            System.out.println("STATUS userId = " + userId);
            return apiService.status(userId);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return null;
    }
}
