package com.example.EventZenUserAttendeeService.dto;

import com.example.EventZenUserAttendeeService.models.Role;
import com.example.EventZenUserAttendeeService.models.User;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;

    // Build from entity — never expose password
    public static UserResponse from(User user) {
        UserResponse res = new UserResponse();
        res.id = user.getId();
        res.name = user.getName();
        res.email = user.getEmail();
        res.role = user.getRole();
        return res;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}