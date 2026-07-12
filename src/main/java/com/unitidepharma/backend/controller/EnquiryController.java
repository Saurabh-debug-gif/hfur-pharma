package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.dto.EnquiryRequest;
import com.unitidepharma.backend.dto.EnquiryResponse;
import com.unitidepharma.backend.service.EnquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/enquiry") // 🔥 PUBLIC API (no auth needed)
@RequiredArgsConstructor
public class EnquiryController {

    private final EnquiryService enquiryService;

    @PostMapping
    public EnquiryResponse create(@RequestBody EnquiryRequest request) {
        return enquiryService.createEnquiry(request);
    }
}