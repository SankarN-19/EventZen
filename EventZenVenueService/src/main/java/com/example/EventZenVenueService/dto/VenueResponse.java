package com.example.EventZenVenueService.dto;

import com.example.EventZenVenueService.models.Venue;
import java.math.BigDecimal;

public class VenueResponse {

    private Long id;
    private String name;
    private String location;
    private Integer capacity;
    private String amenities;
    private BigDecimal pricePerDay;
    private Boolean isActive;

    public static VenueResponse from(Venue venue) {
        VenueResponse res = new VenueResponse();
        res.id = venue.getId();
        res.name = venue.getName();
        res.location = venue.getLocation();
        res.capacity = venue.getCapacity();
        res.amenities = venue.getAmenities();
        res.pricePerDay = venue.getPricePerDay();
        res.isActive = venue.getIsActive();
        return res;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getAmenities() {
        return amenities;
    }

    public BigDecimal getPricePerDay() {
        return pricePerDay;
    }

    public Boolean getIsActive() {
        return isActive;
    }
}