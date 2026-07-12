package com.unitidepharma.backend.repository;

import com.unitidepharma.backend.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByCategoryId(Long categoryId);

    List<Medicine> findByNameContainingIgnoreCase(String keyword);

    // Top 10 latest medicines
    List<Medicine> findTop10ByOrderByCreatedAtDesc();

}