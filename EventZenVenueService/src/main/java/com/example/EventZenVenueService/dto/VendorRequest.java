package com.example.EventZenVenueService.dto;

import jakarta.validation.constraints.*;

public class VendorRequest {

    @NotBlank(message = "Vendor name is required")
    private String name;

    @NotBlank(message = "Service type is required")
    private String service;

    private String email;
    private String phone;

    @NotNull(message = "Venue ID is required")
    private Long venueId;

    // Getters & Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getVenueId() {
        return venueId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }
}