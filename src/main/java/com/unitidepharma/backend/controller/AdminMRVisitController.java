package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.entity.MRVisit;
import com.unitidepharma.backend.service.MRVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/visits")
@RequiredArgsConstructor
public class AdminMRVisitController {

    private final MRVisitService mrVisitService;

    @GetMapping("/{mrId}")
    public List<MRVisit> getMRVisits(@PathVariable Long mrId) {
        return mrVisitService.getVisits(mrId);
    }
}