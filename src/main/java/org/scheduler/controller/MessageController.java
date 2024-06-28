package org.scheduler.controller;

import org.scheduler.model.MessageForm;
import org.scheduler.service.ApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;

public class MessageController {
    private final ApiService apiService;

    public MessageController(ApiService apiService) {
        this.apiService = apiService;
    }

    @PostMapping("/send-message")
    public void sendMessage(@RequestBody MessageForm messageForm) {
        try {
            String message = apiService.sendMessage(messageForm.getMessage(), messageForm.getContactNumber(), messageForm.getDateTime());
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    @GetMapping("/qr-code")
    public void getQrCode(@PathVariable String userId) {
        try {
            String qrCode = apiService.qrCode(userId);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
