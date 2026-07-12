package com.unitidepharma.backend.repository;

import com.unitidepharma.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);

    // ✅ FIXED METHOD (THIS WAS YOUR BUG)
    Optional<CartItem> findByUserIdAndMedicine_Id(Long userId, Long medicineId);
}