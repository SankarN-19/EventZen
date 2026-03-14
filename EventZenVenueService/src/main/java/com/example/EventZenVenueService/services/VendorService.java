package com.example.EventZenVenueService.services;

import com.example.EventZenVenueService.dto.VendorRequest;
import com.example.EventZenVenueService.exceptions.*;
import com.example.EventZenVenueService.models.*;
import com.example.EventZenVenueService.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;
    @Autowired
    private VenueRepository venueRepository;

    public Vendor createVendor(VendorRequest request) {
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new VenueNotFoundException(
                        "Venue with id " + request.getVenueId() + " not found"));

        Vendor vendor = new Vendor();
        vendor.setName(request.getName());
        vendor.setService(request.getService());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setVenue(venue);
        return vendorRepository.save(vendor);
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new VendorNotFoundException(
                        "Vendor with id " + id + " not found"));
    }

    public Vendor updateVendor(Long id, VendorRequest request) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new VendorNotFoundException(
                        "Vendor with id " + id + " not found"));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new VenueNotFoundException(
                        "Venue with id " + request.getVenueId() + " not found"));

        vendor.setName(request.getName());
        vendor.setService(request.getService());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setVenue(venue);
        return vendorRepository.save(vendor);
    }

    public void deleteVendor(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new VendorNotFoundException(
                        "Vendor with id " + id + " not found"));
        vendorRepository.delete(vendor);
    }
}