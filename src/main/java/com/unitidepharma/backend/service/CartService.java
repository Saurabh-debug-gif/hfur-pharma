package com.unitidepharma.backend.service;

import com.unitidepharma.backend.entity.CartItem;
import com.unitidepharma.backend.entity.Medicine;
import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.repository.CartItemRepository;
import com.unitidepharma.backend.repository.MedicineRepository;
import com.unitidepharma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    // ✅ ADD ITEM
    public CartItem addItem(String email, Long medicineId, int quantity) {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        CartItem existing = cartItemRepository
                .findByUserIdAndMedicine_Id(user.getId(), medicineId)
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            return cartItemRepository.save(existing);
        }

        CartItem item = new CartItem();
        item.setUserId(user.getId());
        item.setMedicine(medicine);
        item.setQuantity(quantity);

        return cartItemRepository.save(item);
    }

    // ✅ REMOVE ITEM (FIXED FINAL)
    public String removeItem(String email, Long medicineId) {

        User user = userRepository.findByEmailIgnoreCase(email) // 🔥 FIXED
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartItem item = cartItemRepository
                .findByUserIdAndMedicine_Id(user.getId(), medicineId)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        cartItemRepository.delete(item);

        return "Item removed successfully";
    }
    // ✅ UPDATE QUANTITY (FINAL FIX)
    public CartItem updateQuantity(Long cartItemId, int quantity) {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(quantity);

        return cartItemRepository.save(item);
    }

    // ✅ GET CART
    public List<CartItem> getCart(String email) {

        User user = userRepository.findByEmailIgnoreCase(email) // 🔥 FIXED
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartItemRepository.findByUserId(user.getId());
    }
}