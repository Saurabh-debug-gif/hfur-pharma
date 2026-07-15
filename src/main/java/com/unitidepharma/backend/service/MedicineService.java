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
    @Transactional
    public Medicine addMedicine(MedicineRequest request) {

        validateRequest(request);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Medicine medicine = new Medicine();

        medicine.setName(request.getName());
        medicine.setBrand(request.getBrand());
        medicine.setPrice(request.getPrice());
        medicine.setStock(request.getStock());
        medicine.setDescription(request.getDescription());
        medicine.setCustomAttributes(request.getCustomAttributes());

        medicine.setCategory(category);

        if (request.getImageUrl() != null &&
                !request.getImageUrl().isBlank()) {

            medicine.setImageUrl(request.getImageUrl());

        }

        Medicine savedMedicine = medicineRepository.save(medicine);

        if (savedMedicine.getStock() > 0) {
            saveStockLog(savedMedicine.getId(), savedMedicine.getStock(), "ADD", "INITIAL");
        }

        return savedMedicine;
    }
    // ✅ Update Medicine
    @Transactional
    public Medicine updateMedicine(Long id, MedicineRequest request) {

        validateRequest(request);

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        int previousStock = medicine.getStock();

        medicine.setName(request.getName());
        medicine.setBrand(request.getBrand());
        medicine.setPrice(request.getPrice());
        medicine.setStock(request.getStock());
        medicine.setDescription(request.getDescription());
        medicine.setCustomAttributes(request.getCustomAttributes());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        medicine.setCategory(category);

        if (request.getImageUrl() != null &&
                !request.getImageUrl().isBlank()) {

            medicine.setImageUrl(request.getImageUrl());

        }

        Medicine savedMedicine = medicineRepository.save(medicine);
        int stockDifference = savedMedicine.getStock() - previousStock;

        if (stockDifference != 0) {
            saveStockLog(savedMedicine.getId(), stockDifference, "ADJUST", "MEDICINE_EDIT");
        }

        return savedMedicine;
    }
    // ✅ Delete Medicine
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    // ✅ Get All Medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
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

        if (quantity <= 0) {
            throw new IllegalArgumentException("Stock quantity must be greater than zero");
        }

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setStock(medicine.getStock() + quantity);
        medicineRepository.save(medicine);

        saveStockLog(medicineId, quantity, "ADD", "MANUAL");
    }

    // 🔥 REDUCE STOCK
    @Transactional
    public void reduceStock(Long medicineId, int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException("Stock quantity must be greater than zero");
        }

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (medicine.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        medicine.setStock(medicine.getStock() - quantity);
        medicineRepository.save(medicine);

        saveStockLog(medicineId, -quantity, "REDUCE", "ORDER");
    }

    private void validateRequest(MedicineRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Medicine name is required");
        }
        if (request.getBrand() == null || request.getBrand().isBlank()) {
            throw new IllegalArgumentException("Medicine brand is required");
        }
        if (request.getPrice() < 0) {
            throw new IllegalArgumentException("Medicine price cannot be negative");
        }
        if (request.getStock() < 0) {
            throw new IllegalArgumentException("Medicine stock cannot be negative");
        }
        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("Medicine category is required");
        }
    }

    private void saveStockLog(Long medicineId, int changeAmount, String type, String reason) {
        StockLog log = new StockLog();
        log.setMedicineId(medicineId);
        log.setChangeAmount(changeAmount);
        log.setType(type);
        log.setReason(reason);
        log.setTimestamp(LocalDateTime.now());
        stockLogRepository.save(log);
    }
}
