package com.example.EventZenUserAttendeeService.services;

import com.example.EventZenUserAttendeeService.dto.*;
import com.example.EventZenUserAttendeeService.exceptions.*;
import com.example.EventZenUserAttendeeService.models.User;
import com.example.EventZenUserAttendeeService.repository.UserRepository;
import com.example.EventZenUserAttendeeService.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        return UserResponse.from(userRepository.save(user));
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("No user found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("token", token);
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("id", user.getId());
        return data;
    }
}