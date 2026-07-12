package com.unitidepharma.backend.dto;

import lombok.Data;

@Data
public class MedicineRequest {

    private String name;
    private String brand;
    private double price;
    private int stock;
    private String description;
    private Long categoryId;
    private String imageUrl;
}