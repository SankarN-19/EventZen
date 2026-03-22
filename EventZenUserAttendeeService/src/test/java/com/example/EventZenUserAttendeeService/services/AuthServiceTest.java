package com.example.EventZenUserAttendeeService.services;

import com.example.EventZenUserAttendeeService.dto.LoginRequest;
import com.example.EventZenUserAttendeeService.dto.RegisterRequest;
import com.example.EventZenUserAttendeeService.dto.UserResponse;
import com.example.EventZenUserAttendeeService.exceptions.UserAlreadyExistsException;
import com.example.EventZenUserAttendeeService.exceptions.UserNotFoundException;
import com.example.EventZenUserAttendeeService.models.Role;
import com.example.EventZenUserAttendeeService.models.User;
import com.example.EventZenUserAttendeeService.repository.UserRepository;
import com.example.EventZenUserAttendeeService.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

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

    // ── REGISTER TESTS ──

    @Test
    void register_ShouldReturnUserResponse_WhenEmailIsNew() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("Sankar N");
        request.setEmail("sankar@gmail.com");
        request.setPassword("pass123");
        request.setRole(Role.ATTENDEE);

        when(userRepository.existsByEmail("sankar@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("hashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act
        UserResponse response = authService.register(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("sankar@gmail.com");
        assertThat(response.getName()).isEqualTo("Sankar N");
        assertThat(response.getRole()).isEqualTo(Role.ATTENDEE);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("sankar@gmail.com");
        request.setPassword("pass123");
        request.setName("Sankar N");
        request.setRole(Role.ATTENDEE);

        when(userRepository.existsByEmail("sankar@gmail.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("sankar@gmail.com");

        verify(userRepository, never()).save(any());
    }

    // ── LOGIN TESTS ──

    @Test
    void login_ShouldReturnTokenAndUserData_WhenCredentialsAreValid() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("sankar@gmail.com");
        request.setPassword("pass123");

        when(userRepository.findByEmail("sankar@gmail.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("pass123", "hashedpassword")).thenReturn(true);
        when(jwtUtil.generateToken("sankar@gmail.com", "ATTENDEE")).thenReturn("mock.jwt.token");

        // Act
        Map<String, Object> result = authService.login(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.get("token")).isEqualTo("mock.jwt.token");
        assertThat(result.get("email")).isEqualTo("sankar@gmail.com");
        assertThat(result.get("role")).isEqualTo(Role.ATTENDEE);
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("notexist@gmail.com");
        request.setPassword("pass123");

        when(userRepository.findByEmail("notexist@gmail.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void login_ShouldThrowException_WhenPasswordIsWrong() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("sankar@gmail.com");
        request.setPassword("wrongpassword");

        when(userRepository.findByEmail("sankar@gmail.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrongpassword", "hashedpassword")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid password");
    }
}