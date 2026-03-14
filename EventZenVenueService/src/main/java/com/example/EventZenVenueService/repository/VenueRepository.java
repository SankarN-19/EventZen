package com.example.EventZenVenueService.repository;

import com.example.EventZenVenueService.models.Venue;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {

    // For public browsing — only active venues
    Page<Venue> findByIsActiveTrue(Pageable pageable);

    // Filter by location (case-insensitive)
    Page<Venue> findByIsActiveTrueAndLocationContainingIgnoreCase(
            String location, Pageable pageable);

    // Filter by minimum capacity
    Page<Venue> findByIsActiveTrueAndCapacityGreaterThanEqual(
            Integer capacity, Pageable pageable);

    // Filter by location AND capacity
    Page<Venue> findByIsActiveTrueAndLocationContainingIgnoreCaseAndCapacityGreaterThanEqual(
            String location, Integer capacity, Pageable pageable);
}