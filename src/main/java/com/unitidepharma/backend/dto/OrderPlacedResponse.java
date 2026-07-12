package com.unitidepharma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPlacedResponse {

    private String message;

    private Long orderId;

    private Double totalAmount;

    private String whatsappUrl;

}