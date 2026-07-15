package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.dto.CreateMrRequest;
import com.unitidepharma.backend.dto.MrResponse;
import com.unitidepharma.backend.service.MrService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/mr")
@RequiredArgsConstructor
public class AdminMrController {

    private final MrService mrService;

    @PostMapping("/create")
    public String createMr(@RequestBody CreateMrRequest request) {
        return mrService.createMr(request);
    }


    @GetMapping
    public List<MrResponse> getMRs(){
        return mrService.getAllMRs();
    }

    @PatchMapping("/{mrId}/status")
    public MrResponse updateStatus(@PathVariable Long mrId,
                                   @RequestParam boolean active) {
        return mrService.updateStatus(mrId, active);
    }
}
