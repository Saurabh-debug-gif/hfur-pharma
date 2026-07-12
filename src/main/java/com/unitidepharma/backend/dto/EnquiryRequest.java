package com.unitidepharma.backend.dto;

import lombok.Data;

@Data
public class EnquiryRequest {
    private String name;
    private String email;
    private String phone;
    private String message;
}