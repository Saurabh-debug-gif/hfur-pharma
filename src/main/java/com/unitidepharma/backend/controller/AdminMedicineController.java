package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.entity.Medicine;
import com.unitidepharma.backend.service.ImageService;
import com.unitidepharma.backend.service.MedicineService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;import com.unitidepharma.backend.dto.MedicineRequest;


@RestController
@RequestMapping("/api/admin/medicines")
@RequiredArgsConstructor
public class AdminMedicineController {

    private final MedicineService medicineService;
    private final ImageService imageService; // ✅ FIX: inject service

    // ✅ Add Medicine
    @PostMapping
    public ResponseEntity<Medicine> add(@RequestBody MedicineRequest request) {
        return ResponseEntity.ok(medicineService.addMedicine(request));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String auth
    ) {

        System.out.println("================================");
        System.out.println("UPLOAD ENDPOINT HIT");
        System.out.println("AUTH HEADER = " + auth);
        System.out.println("================================");

        return ResponseEntity.ok(imageService.uploadImage(file));
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
}

