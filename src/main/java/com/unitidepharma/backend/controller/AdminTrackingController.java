package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.entity.MRLocation;
import com.unitidepharma.backend.service.MRTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tracking")
@RequiredArgsConstructor
public class AdminTrackingController {

    private final MRTrackingService trackingService;

    // ✅ Latest location
    @GetMapping("/latest/{mrId}")
    public ResponseEntity<MRLocation> getLatest(@PathVariable Long mrId) {
        MRLocation latest = trackingService.getLatestLocation(mrId);
        return latest == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(latest);
    }

    // ✅ Full history
    @GetMapping("/history/{mrId}")
    public List<MRLocation> getHistory(@PathVariable Long mrId) {
        return trackingService.getLocationHistory(mrId);
    }
}
