package com.example.EventZenUserAttendeeService.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.EventZenUserAttendeeService.models.Role;
import com.example.EventZenUserAttendeeService.models.User;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();

        user = new User();
        user.setName("Sankar N");
        user.setEmail("sankar@gmail.com");
        user.setPassword("hashedpassword");
        user.setRole(Role.ATTENDEE);
    }

    @AfterEach
    public void tearDown() {
        userRepository.deleteAll();
        System.out.println("Cleaned up after test");
    }

    // ── SAVE ──

    @Test
    @DisplayName("Test save user")
    public void testSaveUser() {
        User savedUser = userRepository.save(user);

        assertNotNull(savedUser.getId());
        assertEquals("Sankar N", savedUser.getName());
        assertEquals("sankar@gmail.com", savedUser.getEmail());
        assertEquals(Role.ATTENDEE, savedUser.getRole());
    }

    // ── FIND ALL ──

    @Test
    @DisplayName("Test find all users")
    public void testFindAll() {
        userRepository.save(user);

        User user2 = new User();
        user2.setName("Romal Shetty");
        user2.setEmail("romal@eventzen.com");
        user2.setPassword("hashedpassword");
        user2.setRole(Role.ADMIN);
        userRepository.save(user2);

        User user3 = new User();
        user3.setName("Priya Mehta");
        user3.setEmail("priya@gmail.com");
        user3.setPassword("hashedpassword");
        user3.setRole(Role.ATTENDEE);
        userRepository.save(user3);

        List<User> users = userRepository.findAll();
        assertEquals(3, users.size());
    }

    // ── FIND BY ID ──

    @Test
    @DisplayName("Test find user by id")
    public void testFindById() {
        User savedUser = userRepository.save(user);

        User foundUser = userRepository.findById(savedUser.getId()).orElse(null);

        assertNotNull(foundUser);
        assertEquals(savedUser.getId(), foundUser.getId());
        assertEquals("sankar@gmail.com", foundUser.getEmail());
    }

    @Test
    @DisplayName("Test find by id returns empty when not found")
    public void testFindById_NotFound() {
        Optional<User> foundUser = userRepository.findById(999L);

        assertFalse(foundUser.isPresent());
    }

    // ── FIND BY EMAIL ──

    @Test
    @DisplayName("Test find user by email")
    public void testFindByEmail() {
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findByEmail("sankar@gmail.com");

        assertTrue(foundUser.isPresent());
        assertEquals("Sankar N", foundUser.get().getName());
    }

    @Test
    @DisplayName("Test find by email returns empty when not found")
    public void testFindByEmail_NotFound() {
        Optional<User> foundUser = userRepository.findByEmail("ghost@gmail.com");

        assertFalse(foundUser.isPresent());
    }

    // ── EXISTS BY EMAIL ──

    @Test
    @DisplayName("Test exists by email returns true when email exists")
    public void testExistsByEmail_True() {
        userRepository.save(user);

        boolean exists = userRepository.existsByEmail("sankar@gmail.com");

        assertTrue(exists);
    }

    @Test
    @DisplayName("Test exists by email returns false when email not found")
    public void testExistsByEmail_False() {
        boolean exists = userRepository.existsByEmail("notexist@gmail.com");

        assertFalse(exists);
    }

    // ── UPDATE ──

    @Test
    @DisplayName("Test update user")
    public void testUpdateUser() {
        User savedUser = userRepository.save(user);

        savedUser.setName("Sankar Updated");
        savedUser.setRole(Role.ADMIN);
        userRepository.save(savedUser);

        User updatedUser = userRepository.findById(savedUser.getId()).orElse(null);

        assertNotNull(updatedUser);
        assertEquals("Sankar Updated", updatedUser.getName());
        assertEquals(Role.ADMIN, updatedUser.getRole());
    }

    // ── DELETE ──

    @Test
    @DisplayName("Test delete user by id")
    public void testDeleteById() {
        User savedUser = userRepository.save(user);

        userRepository.deleteById(savedUser.getId());

        assertEquals(0, userRepository.findAll().size());
    }

    @Test
    @DisplayName("Test delete user object directly")
    public void testDeleteUser() {
        User savedUser = userRepository.save(user);

        userRepository.delete(savedUser);

        Optional<User> deletedUser = userRepository.findById(savedUser.getId());
        assertFalse(deletedUser.isPresent());
    }

    // ── ASSERTIONS DEMO ──

    @Test
    @DisplayName("Test assertAll — multiple fields at once")
    public void testAssertAll() {
        User savedUser = userRepository.save(user);

        assertAll(
                () -> assertNotNull(savedUser.getId()),
                () -> assertEquals("Sankar N", savedUser.getName()),
                () -> assertEquals("sankar@gmail.com", savedUser.getEmail()),
                () -> assertEquals(Role.ATTENDEE, savedUser.getRole()));
    }
}