package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.LocationRequest;
import com.unitidepharma.backend.entity.MRLocation;
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

        // ✅ get MR user
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 ensure role = MR
        if (!user.getRole().name().equals("MR")) {
            throw new RuntimeException("Only MR can send location");
        }

        // ✅ save location
        MRLocation location = new MRLocation();
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setMr(user); // 🔥 IMPORTANT

        locationRepository.save(location);

        return "📍 Location data collected";
    }
}