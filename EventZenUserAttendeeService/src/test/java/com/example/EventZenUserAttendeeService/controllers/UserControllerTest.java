package com.example.EventZenUserAttendeeService.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import com.example.EventZenUserAttendeeService.dto.UserResponse;
import com.example.EventZenUserAttendeeService.exceptions.GlobalExceptionHandler;
import com.example.EventZenUserAttendeeService.exceptions.UserNotFoundException;
import com.example.EventZenUserAttendeeService.models.Role;
import com.example.EventZenUserAttendeeService.models.User;
import com.example.EventZenUserAttendeeService.services.UserService;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User mockUser;
    private UserResponse mockUserResponse;

    @BeforeEach
    public void setup() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Sankar N");
        mockUser.setEmail("sankar@gmail.com");
        mockUser.setPassword("hashed");
        mockUser.setRole(Role.ATTENDEE);

        mockUserResponse = UserResponse.from(mockUser);

        mockMvc = MockMvcBuilders
                .standaloneSetup(userController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    // ── GET /users/{id} ──

    @Test
    public void testGetUserById_Success() throws Exception {
        when(userService.getUserById(1L)).thenReturn(mockUserResponse);

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User fetched successfully"))
                .andExpect(jsonPath("$.data.email").value("sankar@gmail.com"))
                .andExpect(jsonPath("$.data.name").value("Sankar N"));
    }

    @Test
    public void testGetUserById_NotFound() throws Exception {
        when(userService.getUserById(99L))
                .thenThrow(new UserNotFoundException("User with id 99 not found"));

        mockMvc.perform(get("/users/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("User with id 99 not found"));
    }

    // ── PUT /users/{id} ──

    @Test
    public void testUpdateUser_Success() throws Exception {
        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setName("Sankar Updated");
        updatedUser.setEmail("sankar.updated@gmail.com");
        updatedUser.setRole(Role.ATTENDEE);

        when(userService.updateUser(eq(1L), any(User.class)))
                .thenReturn(UserResponse.from(updatedUser));

        String updateJson = """
                {
                    "name": "Sankar Updated",
                    "email": "sankar.updated@gmail.com"
                }
                """;

        mockMvc.perform(put("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User updated successfully"))
                .andExpect(jsonPath("$.data.name").value("Sankar Updated"))
                .andExpect(jsonPath("$.data.email").value("sankar.updated@gmail.com"));
    }

    @Test
    public void testUpdateUser_NotFound() throws Exception {
        when(userService.updateUser(eq(99L), any(User.class)))
                .thenThrow(new UserNotFoundException("User with id 99 not found"));

        String updateJson = """
                {
                    "name": "Ghost",
                    "email": "ghost@gmail.com"
                }
                """;

        mockMvc.perform(put("/users/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateJson))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    // ── DELETE /users/{id} ──

    @Test
    public void testDeleteUser_Success() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully"));
    }

    @Test
    public void testDeleteUser_NotFound() throws Exception {
        doThrow(new UserNotFoundException("User with id 99 not found"))
                .when(userService).deleteUser(99L);

        mockMvc.perform(delete("/users/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("User with id 99 not found"));
    }
}