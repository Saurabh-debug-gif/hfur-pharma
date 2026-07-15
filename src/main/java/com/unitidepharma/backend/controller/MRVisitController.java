package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.dto.MRVisitRequest;
import com.unitidepharma.backend.entity.MRVisit;
import com.unitidepharma.backend.service.MRVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mr/visit")
@RequiredArgsConstructor
public class MRVisitController {

    private final MRVisitService mrVisitService;

    @PostMapping("/log")
    public String logVisit(Authentication authentication,
                           @RequestBody MRVisitRequest request) {

        return mrVisitService.logVisit(authentication.getName(), request);
    }

    @GetMapping("/my")
    public List<MRVisit> getMyVisits(Authentication authentication) {
        return mrVisitService.getMyVisits(authentication.getName());
    }
}
