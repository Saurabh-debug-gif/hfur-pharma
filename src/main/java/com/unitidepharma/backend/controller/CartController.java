package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.entity.CartItem;
import com.unitidepharma.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // ✅ ADD ITEM
    @PostMapping("/add")
    public CartItem add(
            @RequestParam Long medicineId,
            @RequestParam int quantity,
            Authentication authentication
    ) {
        return cartService.addItem(authentication.getName(), medicineId, quantity);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public CartItem update(
            @PathVariable Long id,
            @RequestParam int quantity
    ) {
        return cartService.updateQuantity(id, quantity);
    }

    // ✅ REMOVE (IMPORTANT PATH)
    @DeleteMapping("/remove")
    public String remove(
            @RequestParam Long medicineId,
            Authentication authentication
    ) {
        return cartService.removeItem(authentication.getName(), medicineId);
    }

    // ✅ GET CART
    @GetMapping
    public List<CartItem> getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }
}