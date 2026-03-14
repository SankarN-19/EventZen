package com.example.EventZenUserAttendeeService.controllers;

import com.example.EventZenUserAttendeeService.models.Attendee;
import com.example.EventZenUserAttendeeService.services.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/attendees")
public class AttendeeController {

    @Autowired
    private AttendeeService attendeeService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addAttendee(@RequestParam Long userId,
            @RequestBody Attendee attendee) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Attendee added successfully");
        response.put("data", attendeeService.addAttendee(userId, attendee));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllAttendees() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Attendees fetched successfully");
        response.put("data", attendeeService.getAllAttendees());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAttendeeById(@PathVariable Long id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Attendee fetched successfully");
        response.put("data", attendeeService.getAttendeeById(id));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAttendee(@PathVariable Long id) {
        attendeeService.deleteAttendee(id);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Attendee deleted successfully");
        response.put("data", null);
        return ResponseEntity.ok(response);
    }
}