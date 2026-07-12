package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.entity.Medicine;
import com.unitidepharma.backend.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/medicines")
@RequiredArgsConstructor
public class PublicMedicineController {

    private final MedicineService medicineService;

    // Get all medicines
    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getMedicines();
    }

    // Top 10 medicines
    @GetMapping("/top10")
    public List<Medicine> getTopMedicines() {
        return medicineService.getTopMedicines();
    }

    // Get medicine by id
    @GetMapping("/{id}")
    public Medicine getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id);
    }

    // Search medicines
    @GetMapping("/search")
    public List<Medicine> searchMedicines(
            @RequestParam String keyword
    ) {
        return medicineService.searchMedicines(keyword);
    }
}