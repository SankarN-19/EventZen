package com.example.EventZenUserAttendeeService.controllers;

import com.example.EventZenUserAttendeeService.dto.*;
import com.example.EventZenUserAttendeeService.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "User registered successfully");
        response.put("data", user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        Map<String, Object> data = authService.login(request);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Login successful");
        response.put("data", data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Logged out successfully — discard token on client");
        response.put("data", null);
        return ResponseEntity.ok(response);
    }
}