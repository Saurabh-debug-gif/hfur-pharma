package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.entity.Medicine;
import com.unitidepharma.backend.entity.Category;
import com.unitidepharma.backend.dto.MedicineRequest;
import com.unitidepharma.backend.service.ImageService;
import com.unitidepharma.backend.service.MedicineService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/admin/medicines")
@RequiredArgsConstructor
public class AdminMedicineController {

    private final MedicineService medicineService;
    private final ImageService imageService; // ✅ FIX: inject service

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(imageService.uploadImage(file));
    }
    // ✅ Add Medicine
    @PostMapping
    public ResponseEntity<Medicine> add(@RequestBody MedicineRequest request) {
        return ResponseEntity.ok(medicineService.addMedicine(request));
    }

    // ✅ Add Stock
    @PostMapping("/{id}/add-stock")
    public String addStock(@PathVariable Long id,
                           @RequestParam int quantity) {

        medicineService.addStock(id, quantity);
        return "Stock added successfully";
    }

    // ✅ Update
    @PutMapping("/{id}")
    public ResponseEntity<Medicine> update(@PathVariable Long id,
                                           @RequestBody MedicineRequest request) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, request));
    }

    // ✅ Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ✅ Fetch All
    @GetMapping
    public ResponseEntity<List<Medicine>> getAll() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    // Categories used by the add/edit form.
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(medicineService.getAllCategories());
    }
}
