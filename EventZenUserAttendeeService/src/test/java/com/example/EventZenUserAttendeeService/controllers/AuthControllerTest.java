package com.example.EventZenUserAttendeeService.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.EventZenUserAttendeeService.dto.LoginRequest;
import com.example.EventZenUserAttendeeService.dto.RegisterRequest;
import com.example.EventZenUserAttendeeService.dto.UserResponse;
import com.example.EventZenUserAttendeeService.exceptions.GlobalExceptionHandler;
import com.example.EventZenUserAttendeeService.exceptions.UserAlreadyExistsException;
import com.example.EventZenUserAttendeeService.exceptions.UserNotFoundException;
import com.example.EventZenUserAttendeeService.models.Role;
import com.example.EventZenUserAttendeeService.models.User;
import com.example.EventZenUserAttendeeService.services.AuthService;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private User mockUser;

    @BeforeEach
    public void setup() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Sankar N");
        mockUser.setEmail("sankar@gmail.com");
        mockUser.setPassword("hashed");
        mockUser.setRole(Role.ATTENDEE);

        mockMvc = MockMvcBuilders
                .standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    // ── POST /auth/register ──

    @Test
    public void testRegister_Success() throws Exception {
        UserResponse mockResponse = UserResponse.from(mockUser);
        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        String registerJson = """
                {
                    "name": "Sankar N",
                    "email": "sankar@gmail.com",
                    "password": "pass123",
                    "role": "ATTENDEE"
                }
                """;

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data.email").value("sankar@gmail.com"));
    }

    @Test
    public void testRegister_DuplicateEmail() throws Exception {
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new UserAlreadyExistsException(
                        "User with email sankar@gmail.com already exists"));

        String registerJson = """
                {
                    "name": "Sankar N",
                    "email": "sankar@gmail.com",
                    "password": "pass123",
                    "role": "ATTENDEE"
                }
                """;

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    // ── POST /auth/login ──

    @Test
    public void testLogin_Success() throws Exception {
        Map<String, Object> mockData = Map.of(
                "token", "mock.jwt.token",
                "email", "sankar@gmail.com",
                "role", "ATTENDEE",
                "id", 1L);
        when(authService.login(any(LoginRequest.class))).thenReturn(mockData);

        String loginJson = """
                {
                    "email": "sankar@gmail.com",
                    "password": "pass123"
                }
                """;

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.token").value("mock.jwt.token"))
                .andExpect(jsonPath("$.data.email").value("sankar@gmail.com"));
    }

    @Test
    public void testLogin_UserNotFound() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new UserNotFoundException(
                        "No user found with email: ghost@gmail.com"));

        String loginJson = """
                {
                    "email": "ghost@gmail.com",
                    "password": "pass123"
                }
                """;

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    public void testLogin_WrongPassword() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid password"));

        String loginJson = """
                {
                    "email": "sankar@gmail.com",
                    "password": "wrongpassword"
                }
                """;

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isInternalServerError());
    }

    // ── POST /auth/logout ──

    @Test
    public void testLogout_Success() throws Exception {
        mockMvc.perform(post("/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Logged out successfully — discard token on client"));
    }
}