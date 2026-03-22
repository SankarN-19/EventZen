package com.example.EventZenUserAttendeeService.services;

import com.example.EventZenUserAttendeeService.dto.UserResponse;
import com.example.EventZenUserAttendeeService.exceptions.UserNotFoundException;
import com.example.EventZenUserAttendeeService.models.Role;
import com.example.EventZenUserAttendeeService.models.User;
import com.example.EventZenUserAttendeeService.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Sankar N");
        mockUser.setEmail("sankar@gmail.com");
        mockUser.setPassword("hashedpassword");
        mockUser.setRole(Role.ATTENDEE);
    }

    // ── GET USER ──

    @Test
    void getUserById_ShouldReturnUser_WhenExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        UserResponse response = userService.getUserById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("sankar@gmail.com");
        assertThat(response.getName()).isEqualTo("Sankar N");
    }

    @Test
    void getUserById_ShouldThrowException_WhenNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(99L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ── UPDATE USER ──

    @Test
    void updateUser_ShouldReturnUpdatedUser_WhenExists() {
        User updatedData = new User();
        updatedData.setName("Sankar Updated");
        updatedData.setEmail("sankar.updated@gmail.com");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Sankar Updated");
        savedUser.setEmail("sankar.updated@gmail.com");
        savedUser.setRole(Role.ATTENDEE);

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = userService.updateUser(1L, updatedData);

        assertThat(response.getName()).isEqualTo("Sankar Updated");
        assertThat(response.getEmail()).isEqualTo("sankar.updated@gmail.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUser(99L, new User()))
                .isInstanceOf(UserNotFoundException.class);

        verify(userRepository, never()).save(any());
    }

    // ── DELETE USER ──

    @Test
    void deleteUser_ShouldDeleteSuccessfully_WhenExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        doNothing().when(userRepository).delete(mockUser);

        assertThatNoException().isThrownBy(() -> userService.deleteUser(1L));
        verify(userRepository).delete(mockUser);
    }

    @Test
    void deleteUser_ShouldThrowException_WhenNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.deleteUser(99L))
                .isInstanceOf(UserNotFoundException.class);

        verify(userRepository, never()).delete(any());
    }
}