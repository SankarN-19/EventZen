package com.example.EventZenVenueService.services;

import com.example.EventZenVenueService.dto.*;
import com.example.EventZenVenueService.exceptions.VenueNotFoundException;
import com.example.EventZenVenueService.models.Venue;
import com.example.EventZenVenueService.repository.VenueRepository;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    public VenueResponse createVenue(VenueRequest request) {
        Venue venue = new Venue();
        venue.setName(request.getName());
        venue.setLocation(request.getLocation());
        venue.setCapacity(request.getCapacity());
        venue.setAmenities(request.getAmenities());
        venue.setPricePerDay(request.getPricePerDay());
        return VenueResponse.from(venueRepository.save(venue));
    }

    public Page<VenueResponse> getAllVenues(Pageable pageable) {
        return venueRepository.findAll(pageable).map(VenueResponse::from);
    }

    public Page<VenueResponse> browseVenues(String location, Integer capacity, Pageable pageable) {
        if (location != null && capacity != null) {
            return venueRepository
                    .findByIsActiveTrueAndLocationContainingIgnoreCaseAndCapacityGreaterThanEqual(
                            location, capacity, pageable)
                    .map(VenueResponse::from);
        } else if (location != null) {
            return venueRepository
                    .findByIsActiveTrueAndLocationContainingIgnoreCase(location, pageable)
                    .map(VenueResponse::from);
        } else if (capacity != null) {
            return venueRepository
                    .findByIsActiveTrueAndCapacityGreaterThanEqual(capacity, pageable)
                    .map(VenueResponse::from);
        }
        return venueRepository.findByIsActiveTrue(pageable).map(VenueResponse::from);
    }

    public VenueResponse getVenueById(Long id) {
        return VenueResponse.from(findVenueOrThrow(id));
    }

    public VenueResponse updateVenue(Long id, VenueRequest request) {
        Venue venue = findVenueOrThrow(id);
        venue.setName(request.getName());
        venue.setLocation(request.getLocation());
        venue.setCapacity(request.getCapacity());
        venue.setAmenities(request.getAmenities());
        venue.setPricePerDay(request.getPricePerDay());
        return VenueResponse.from(venueRepository.save(venue));
    }

    // Soft delete — keeps record in DB, just marks inactive
    public void deleteVenue(Long id) {
        Venue venue = findVenueOrThrow(id);
        venue.setIsActive(false);
        venueRepository.save(venue);
    }

    public VenueResponse reactivateVenue(Long id) {
    Venue venue = findVenueOrThrow(id);
    venue.setIsActive(true);
    return VenueResponse.from(venueRepository.save(venue));
}

    public Map<String, Object> checkAvailability(Long id, String from, String to) {
        Venue venue = findVenueOrThrow(id);
        // Availability logic — you can extend this later
        // For now returns venue info with available status
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("venueId", venue.getId());
        result.put("venueName", venue.getName());
        result.put("capacity", venue.getCapacity());
        result.put("requestedFrom", from);
        result.put("requestedTo", to);
        result.put("status", "AVAILABLE"); // Extend with actual booking checks later
        return result;
    }

    private Venue findVenueOrThrow(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new VenueNotFoundException("Venue with id " + id + " not found"));
    }
}