package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.MRVisitRequest;
import com.unitidepharma.backend.entity.MRVisit;
import com.unitidepharma.backend.entity.Role;
import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.repository.MRVisitRepository;
import com.unitidepharma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MRVisitService {

    private final MRVisitRepository mrVisitRepository;
    private final UserRepository userRepository;

    // ✅ MR logs visit
    public String logVisit(String email, MRVisitRequest request) {

        User mr = getActiveMr(email);

        if (request == null || request.getShopName() == null || request.getShopName().isBlank()) {
            throw new IllegalArgumentException("Shop or doctor name is required");
        }

        MRVisit visit = new MRVisit();
        visit.setShopName(request.getShopName().trim());
        visit.setNotes(request.getNotes() == null ? null : request.getNotes().trim());
        visit.setMr(mr);

        mrVisitRepository.save(visit);

        return "Visit logged successfully";
    }

    // ✅ Admin gets MR visit history
    public List<MRVisit> getVisits(Long mrId) {
        User mr = userRepository.findById(mrId)
                .orElseThrow(() -> new RuntimeException("MR not found"));
        if (mr.getRole() != Role.MR) {
            throw new IllegalArgumentException("Selected user is not an MR");
        }
        return mrVisitRepository.findByMrIdOrderByTimestampDesc(mrId);
    }

    public List<MRVisit> getMyVisits(String email) {
        User mr = getActiveMr(email);
        return mrVisitRepository.findByMrIdOrderByTimestampDesc(mr.getId());
    }

    private User getActiveMr(String email) {
        User mr = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("MR not found"));

        if (mr.getRole() != Role.MR) {
            throw new RuntimeException("Only an MR can log visits");
        }
        if (!mr.isActive()) {
            throw new RuntimeException("MR account is inactive");
        }
        return mr;
    }
}
