package com.example.EventZenUserAttendeeService.services;

import com.example.EventZenUserAttendeeService.exceptions.UserNotFoundException;
import com.example.EventZenUserAttendeeService.models.Attendee;
import com.example.EventZenUserAttendeeService.models.User;
import com.example.EventZenUserAttendeeService.repository.AttendeeRepository;
import com.example.EventZenUserAttendeeService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AttendeeService {

    @Autowired
    private AttendeeRepository attendeeRepository;
    @Autowired
    private UserRepository userRepository;

    public Attendee addAttendee(Long userId, Attendee attendeeData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with id " + userId + " not found"));
        attendeeData.setUser(user);
        return attendeeRepository.save(attendeeData);
    }

    public List<Attendee> getAllAttendees() {
        return attendeeRepository.findAll();
    }

    public Attendee getAttendeeById(Long id) {
        return attendeeRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Attendee with id " + id + " not found"));
    }

    public void deleteAttendee(Long id) {
        Attendee attendee = attendeeRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Attendee with id " + id + " not found"));
        attendeeRepository.delete(attendee);
    }
}