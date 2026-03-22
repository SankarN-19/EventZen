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

import com.example.EventZenUserAttendeeService.models.Attendee;
import com.example.EventZenUserAttendeeService.models.Role;
import com.example.EventZenUserAttendeeService.models.User;

@SpringBootTest
public class AttendeeRepositoryTest {

    @Autowired
    private AttendeeRepository attendeeRepository;

    @Autowired
    private UserRepository userRepository;

    private User savedUser;
    private Attendee attendee;

    @BeforeEach
    public void setup() {
        attendeeRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setName("Sankar N");
        user.setEmail("sankar@gmail.com");
        user.setPassword("hashedpassword");
        user.setRole(Role.ATTENDEE);
        savedUser = userRepository.save(user);

        attendee = new Attendee();
        attendee.setUser(savedUser);
        attendee.setPhone("9876543210");
        attendee.setAddress("Bhubaneswar, Odisha");
        attendee.setAttendeeName("Sankar N");
        attendee.setEventId("event-mongo-id-001");
    }

    @AfterEach
    public void tearDown() {
        attendeeRepository.deleteAll();
        userRepository.deleteAll();
        System.out.println("Cleaned up after test");
    }

    // ── SAVE ──

    @Test
    @DisplayName("Test save attendee")
    public void testSaveAttendee() {
        Attendee savedAttendee = attendeeRepository.save(attendee);

        assertNotNull(savedAttendee.getId());
        assertEquals("9876543210", savedAttendee.getPhone());
        assertEquals("Bhubaneswar, Odisha", savedAttendee.getAddress());
        assertEquals("Sankar N", savedAttendee.getAttendeeName());
    }

    // ── FIND ALL ──

    @Test
    @DisplayName("Test find all attendees")
    public void testFindAll() {
        attendeeRepository.save(attendee);

        User user2 = new User();
        user2.setName("Priya Mehta");
        user2.setEmail("priya@gmail.com");
        user2.setPassword("hashedpassword");
        user2.setRole(Role.ATTENDEE);
        User savedUser2 = userRepository.save(user2);

        Attendee attendee2 = new Attendee();
        attendee2.setUser(savedUser2);
        attendee2.setPhone("9876543221");
        attendee2.setAddress("Bangalore, Karnataka");
        attendee2.setAttendeeName("Priya Mehta");
        attendeeRepository.save(attendee2);

        List<Attendee> attendees = attendeeRepository.findAll();
        assertEquals(2, attendees.size());
    }

    // ── FIND BY ID ──

    @Test
    @DisplayName("Test find attendee by id")
    public void testFindById() {
        Attendee savedAttendee = attendeeRepository.save(attendee);

        Attendee foundAttendee = attendeeRepository.findById(savedAttendee.getId()).orElse(null);

        assertNotNull(foundAttendee);
        assertEquals(savedAttendee.getId(), foundAttendee.getId());
        assertEquals("9876543210", foundAttendee.getPhone());
    }

    @Test
    @DisplayName("Test find by id returns empty when not found")
    public void testFindById_NotFound() {
        Optional<Attendee> foundAttendee = attendeeRepository.findById(999L);

        assertFalse(foundAttendee.isPresent());
    }

    // ── FIND BY USER ID ──

    @Test
    @DisplayName("Test find attendee by user id")
    public void testFindByUserId() {
        attendeeRepository.save(attendee);

        Optional<Attendee> foundAttendee = attendeeRepository
                .findByUserId(savedUser.getId());

        assertTrue(foundAttendee.isPresent());
        assertEquals("9876543210", foundAttendee.get().getPhone());
        assertEquals(savedUser.getId(), foundAttendee.get().getUser().getId());
    }

    @Test
    @DisplayName("Test find by user id returns empty when not found")
    public void testFindByUserId_NotFound() {
        Optional<Attendee> foundAttendee = attendeeRepository.findByUserId(999L);

        assertFalse(foundAttendee.isPresent());
    }

    // ── UPDATE ──

    @Test
    @DisplayName("Test update attendee")
    public void testUpdateAttendee() {
        Attendee savedAttendee = attendeeRepository.save(attendee);

        savedAttendee.setPhone("9999999999");
        savedAttendee.setAddress("Mumbai, Maharashtra");
        attendeeRepository.save(savedAttendee);

        Attendee updatedAttendee = attendeeRepository
                .findById(savedAttendee.getId()).orElse(null);

        assertNotNull(updatedAttendee);
        assertEquals("9999999999", updatedAttendee.getPhone());
        assertEquals("Mumbai, Maharashtra", updatedAttendee.getAddress());
    }

    // ── DELETE ──

    @Test
    @DisplayName("Test delete attendee by id")
    public void testDeleteById() {
        Attendee savedAttendee = attendeeRepository.save(attendee);

        attendeeRepository.deleteById(savedAttendee.getId());

        assertEquals(0, attendeeRepository.findAll().size());
    }

    @Test
    @DisplayName("Test delete attendee object directly")
    public void testDeleteAttendee() {
        Attendee savedAttendee = attendeeRepository.save(attendee);

        attendeeRepository.delete(savedAttendee);

        Optional<Attendee> deleted = attendeeRepository.findById(savedAttendee.getId());
        assertFalse(deleted.isPresent());
    }

    // ── ASSERTIONS DEMO ──

    @Test
    @DisplayName("Test assertAll — multiple attendee fields")
    public void testAssertAll() {
        Attendee savedAttendee = attendeeRepository.save(attendee);

        assertAll(
                () -> assertNotNull(savedAttendee.getId()),
                () -> assertEquals("Sankar N", savedAttendee.getAttendeeName()),
                () -> assertEquals("9876543210", savedAttendee.getPhone()),
                () -> assertEquals("Bhubaneswar, Odisha", savedAttendee.getAddress()),
                () -> assertNotNull(savedAttendee.getUser()));
    }

    @Test
    @DisplayName("Test null check on attendee user")
    public void testAttendeeUserIsNotNull() {
        Attendee savedAttendee = attendeeRepository.save(attendee);

        assertNotNull(savedAttendee.getUser());
        assertEquals("sankar@gmail.com", savedAttendee.getUser().getEmail());
    }
}