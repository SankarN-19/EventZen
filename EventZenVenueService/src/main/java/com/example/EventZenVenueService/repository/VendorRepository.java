package com.example.EventZenVenueService.repository;

import com.example.EventZenVenueService.models.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByVenueId(Long venueId);
}