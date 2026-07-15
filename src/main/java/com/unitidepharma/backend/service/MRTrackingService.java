package com.unitidepharma.backend.service;

import com.unitidepharma.backend.entity.MRLocation;
import com.unitidepharma.backend.entity.Role;
import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.repository.MRLocationRepository;
import com.unitidepharma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MRTrackingService {

    private final MRLocationRepository mrLocationRepository;
    private final UserRepository userRepository;

    // ✅ Get latest location
    public MRLocation getLatestLocation(Long mrId) {

        User mr = getMr(mrId);

        return mrLocationRepository.findTopByMrIdOrderByTimestampDesc(mr.getId());
    }

    // ✅ Get full history
    public List<MRLocation> getLocationHistory(Long mrId) {

        User mr = getMr(mrId);

        return mrLocationRepository.findByMrIdOrderByTimestampDesc(mr.getId());
    }

    private User getMr(Long mrId) {
        User mr = userRepository.findById(mrId)
                .orElseThrow(() -> new RuntimeException("MR not found"));

        if (mr.getRole() != Role.MR) {
            throw new IllegalArgumentException("Selected user is not an MR");
        }
        return mr;
    }
}
