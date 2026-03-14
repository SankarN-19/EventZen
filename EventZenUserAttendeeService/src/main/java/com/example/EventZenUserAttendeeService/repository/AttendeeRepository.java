package com.example.EventZenUserAttendeeService.repository;

import com.example.EventZenUserAttendeeService.models.Attendee;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
    Optional<Attendee> findByUserId(Long userId);
}
