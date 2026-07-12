package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.dto.OrderPlacedResponse;
import com.unitidepharma.backend.entity.Order;
import com.unitidepharma.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // =============================
    // PLACE ORDER
    // =============================

    @PostMapping("/place")
    public OrderPlacedResponse placeOrder(Authentication authentication) {

        return orderService.placeOrder(authentication.getName());

    }

    // =============================
    // GET MY ORDERS
    // =============================

    @GetMapping
    public List<Order> getOrders(Authentication authentication){

        return orderService.getOrders(authentication.getName());

    }

}