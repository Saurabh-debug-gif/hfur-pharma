package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.EnquiryRequest;
import com.unitidepharma.backend.dto.EnquiryResponse;
import com.unitidepharma.backend.entity.Enquiry;
import com.unitidepharma.backend.repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;

    // Same WhatsApp business number used across the site
    private static final String WHATSAPP_NUMBER = "918693030619";

    public EnquiryResponse createEnquiry(EnquiryRequest request) {

        // ✅ Save in DB
        Enquiry enquiry = new Enquiry();
        enquiry.setName(request.getName());
        enquiry.setEmail(request.getEmail());
        enquiry.setPhone(request.getPhone());
        enquiry.setMessage(request.getMessage());

        enquiryRepository.save(enquiry);

        // ✅ Create WhatsApp message
        String text = "New Enquiry\n"
                + "Name: " + request.getName() + "\n"
                + "Email: " + request.getEmail() + "\n"
                + "Phone: " + request.getPhone() + "\n"
                + "Message: " + request.getMessage();

        // ✅ WhatsApp URL (properly URL-encoded)
        String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
        String whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodedText;

        return new EnquiryResponse("✅ Enquiry submitted successfully.", whatsappUrl);
    }
}