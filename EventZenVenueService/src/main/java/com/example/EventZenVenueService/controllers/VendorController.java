package com.example.EventZenVenueService.controllers;

import com.example.EventZenVenueService.dto.VendorRequest;
import com.example.EventZenVenueService.services.VendorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/vendors")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createVendor(@Valid @RequestBody VendorRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Vendor created successfully");
        response.put("data", vendorService.createVendor(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVendors() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Vendors fetched successfully");
        response.put("data", vendorService.getAllVendors());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVendorById(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Vendor fetched successfully");
        response.put("data", vendorService.getVendorById(id));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateVendor(@PathVariable Long id,
            @Valid @RequestBody VendorRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Vendor updated successfully");
        response.put("data", vendorService.updateVendor(id, request));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Vendor deleted successfully");
        response.put("data", null);
        return ResponseEntity.ok(response);
    }
}