package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.MRVisitRequest;
import com.unitidepharma.backend.entity.MRVisit;
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

        User mr = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("MR not found"));

        MRVisit visit = new MRVisit();
        visit.setShopName(request.getShopName());
        visit.setNotes(request.getNotes());
        visit.setMr(mr);

        mrVisitRepository.save(visit);

        return "Visit logged successfully";
    }

    // ✅ Admin gets MR visit history
    public List<MRVisit> getVisits(Long mrId) {
        return mrVisitRepository.findByMrIdOrderByTimestampDesc(mrId);
    }
}