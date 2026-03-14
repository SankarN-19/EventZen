package com.example.EventZenUserAttendeeService.controllers;

import com.example.EventZenUserAttendeeService.models.User;
import com.example.EventZenUserAttendeeService.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "User fetched successfully");
        response.put("data", userService.getUserById(id));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id,
            @RequestBody User updatedData) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "User updated successfully");
        response.put("data", userService.updateUser(id, updatedData));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "User deleted successfully");
        response.put("data", null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Users fetched successfully");
        response.put("data", userService.getAllUsers(pageable));
        return ResponseEntity.ok(response);
    }
}