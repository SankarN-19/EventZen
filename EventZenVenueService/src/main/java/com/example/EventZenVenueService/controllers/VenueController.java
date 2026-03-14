package com.example.EventZenVenueService.controllers;

import com.example.EventZenVenueService.dto.*;
import com.example.EventZenVenueService.services.VenueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/venues")
public class VenueController {

    @Autowired
    private VenueService venueService;

    // ADMIN — create venue
    @PostMapping
    public ResponseEntity<Map<String, Object>> createVenue(@Valid @RequestBody VenueRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Venue created successfully");
        response.put("data", venueService.createVenue(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ADMIN — get all venues (including inactive)
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllVenues(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Venues fetched successfully");
        response.put("data", venueService.getAllVenues(pageable));
        return ResponseEntity.ok(response);
    }

    // PUBLIC — browse active venues with optional filters
    @GetMapping
    public ResponseEntity<Map<String, Object>> browseVenues(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Venues fetched successfully");
        response.put("data", venueService.browseVenues(location, capacity, pageable));
        return ResponseEntity.ok(response);
    }

    // PUBLIC — get single venue
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVenueById(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Venue fetched successfully");
        response.put("data", venueService.getVenueById(id));
        return ResponseEntity.ok(response);
    }

    // ADMIN — update venue
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateVenue(@PathVariable Long id,
            @Valid @RequestBody VenueRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Venue updated successfully");
        response.put("data", venueService.updateVenue(id, request));
        return ResponseEntity.ok(response);
    }

    // ADMIN — soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Venue deactivated successfully");
        response.put("data", null);
        return ResponseEntity.ok(response);
    }

    // ADMIN — reactivate venue
    @PutMapping("/{id}/reactivate")
    public ResponseEntity<Map<String, Object>> reactivateVenue(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Venue reactivated successfully");
        response.put("data", venueService.reactivateVenue(id));
        return ResponseEntity.ok(response);
    }

    // PUBLIC — check availability
    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(
            @PathVariable Long id,
            @RequestParam String from,
            @RequestParam String to) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Availability fetched successfully");
        response.put("data", venueService.checkAvailability(id, from, to));
        return ResponseEntity.ok(response);
    }
}