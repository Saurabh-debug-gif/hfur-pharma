package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.MedicineRequest;
import com.unitidepharma.backend.entity.Category;
import com.unitidepharma.backend.entity.Medicine;
import com.unitidepharma.backend.entity.StockLog;
import com.unitidepharma.backend.repository.CategoryRepository;
import com.unitidepharma.backend.repository.MedicineRepository;
import com.unitidepharma.backend.repository.StockLogRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;
    private final StockLogRepository stockLogRepository;

    // ✅ Add Medicine
    // ✅ Add Medicine
    public Medicine addMedicine(MedicineRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Medicine medicine = new Medicine();

        medicine.setName(request.getName());
        medicine.setBrand(request.getBrand());
        medicine.setPrice(request.getPrice());
        medicine.setStock(request.getStock());
        medicine.setDescription(request.getDescription());

        medicine.setCategory(category);

        if (request.getImageUrl() != null &&
                !request.getImageUrl().isBlank()) {

            medicine.setImageUrl(request.getImageUrl());

        }

        return medicineRepository.save(medicine);
    }
    // ✅ Update Medicine
    public Medicine updateMedicine(Long id, MedicineRequest request) {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setName(request.getName());
        medicine.setBrand(request.getBrand());
        medicine.setPrice(request.getPrice());
        medicine.setStock(request.getStock());
        medicine.setDescription(request.getDescription());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        medicine.setCategory(category);

        if (request.getImageUrl() != null &&
                !request.getImageUrl().isBlank()) {

            medicine.setImageUrl(request.getImageUrl());

        }

        return medicineRepository.save(medicine);
    }
    // ✅ Delete Medicine
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    // ✅ Get All Medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // =========================
// PUBLIC METHODS
// =========================

    // Get all medicines
    public List<Medicine> getMedicines() {
        return medicineRepository.findAll();
    }

    // Get top 10 medicines
    public List<Medicine> getTopMedicines() {
        return medicineRepository.findTop10ByOrderByCreatedAtDesc();
    }

    // Get medicine by id
    public Medicine getMedicineById(Long id) {

        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    // Search medicines
    public List<Medicine> searchMedicines(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return medicineRepository.findAll();
        }

        return medicineRepository.findByNameContainingIgnoreCase(keyword);
    }


    // 🔥 ADD STOCK
    @Transactional
    public void addStock(Long medicineId, int quantity) {

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setStock(medicine.getStock() + quantity);
        medicineRepository.save(medicine);

        StockLog log = new StockLog();
        log.setMedicineId(medicineId);
        log.setChangeAmount(quantity);
        log.setType("ADD");
        log.setReason("MANUAL");
        log.setTimestamp(LocalDateTime.now());

        stockLogRepository.save(log);
    }

    // 🔥 REDUCE STOCK
    @Transactional
    public void reduceStock(Long medicineId, int quantity) {

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (medicine.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        medicine.setStock(medicine.getStock() - quantity);
        medicineRepository.save(medicine);

        StockLog log = new StockLog();
        log.setMedicineId(medicineId);
        log.setChangeAmount(-quantity);
        log.setType("REDUCE");
        log.setReason("ORDER");
        log.setTimestamp(LocalDateTime.now());

        stockLogRepository.save(log);
    }
}