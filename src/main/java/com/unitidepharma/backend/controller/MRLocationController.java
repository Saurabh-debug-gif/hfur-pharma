package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.dto.LocationRequest;
import com.unitidepharma.backend.entity.MRLocation;
import com.unitidepharma.backend.service.MRLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mr/location")
@RequiredArgsConstructor
public class MRLocationController {

    private final MRLocationService locationService;

    @PostMapping("/update")
    public String updateLocation(
            @RequestBody LocationRequest request,
            Authentication authentication
    ) {
        return locationService.updateLocation(authentication.getName(), request);
    }

    @GetMapping("/latest")
    public ResponseEntity<MRLocation> getLatestLocation(Authentication authentication) {
        MRLocation latest = locationService.getLatestLocation(authentication.getName());
        return latest == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(latest);
    }
}
