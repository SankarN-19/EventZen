package com.example.EventZenUserAttendeeService.services;

import com.example.EventZenUserAttendeeService.dto.UserResponse;
import com.example.EventZenUserAttendeeService.exceptions.UserNotFoundException;
import com.example.EventZenUserAttendeeService.models.User;
import com.example.EventZenUserAttendeeService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));
        return UserResponse.from(user);
    }

    public UserResponse updateUser(Long id, User updatedData) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));
        user.setName(updatedData.getName());
        user.setEmail(updatedData.getEmail());
        return UserResponse.from(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));
        userRepository.delete(user);
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserResponse::from);
    }
}