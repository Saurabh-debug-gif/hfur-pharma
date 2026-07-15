package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.LocationRequest;
import com.unitidepharma.backend.entity.MRLocation;
import com.unitidepharma.backend.entity.Role;
import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.repository.MRLocationRepository;
import com.unitidepharma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MRLocationService {

    private final MRLocationRepository locationRepository;
    private final UserRepository userRepository;

    public String updateLocation(String email, LocationRequest request) {

        User user = getActiveMr(email);
        validateCoordinates(request);

        // ✅ save location
        MRLocation location = new MRLocation();
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setMr(user); // 🔥 IMPORTANT

        locationRepository.save(location);

        return "📍 Location data collected";
    }

    public MRLocation getLatestLocation(String email) {
        User mr = getActiveMr(email);
        return locationRepository.findTopByMrIdOrderByTimestampDesc(mr.getId());
    }

    private User getActiveMr(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("MR not found"));

        if (user.getRole() != Role.MR) {
            throw new RuntimeException("Only an MR can use location tracking");
        }
        if (!user.isActive()) {
            throw new RuntimeException("MR account is inactive");
        }
        return user;
    }

    private void validateCoordinates(LocationRequest request) {
        if (request == null || request.getLatitude() == null || request.getLongitude() == null) {
            throw new IllegalArgumentException("Latitude and longitude are required");
        }

        double latitude = request.getLatitude();
        double longitude = request.getLongitude();

        if (!Double.isFinite(latitude) || latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90");
        }
        if (!Double.isFinite(longitude) || longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180");
        }
    }
}
