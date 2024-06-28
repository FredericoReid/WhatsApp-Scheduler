package org.scheduler.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.scheduler.service.ApiService;

import java.io.IOException;

@RestController
public class LoginAuthenticationController {
    private final ApiService apiService;

    public LoginAuthenticationController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/login")
    public String login(@PathVariable String userId) throws IOException, InterruptedException {
        return apiService.login(userId);
    }
}
