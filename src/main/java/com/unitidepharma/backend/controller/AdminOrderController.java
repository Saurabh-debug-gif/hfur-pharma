package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.entity.Order;
import com.unitidepharma.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    // Get All Orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Update Order Status
    @PutMapping("/{orderId}/status")
    public String updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {

        orderService.updateStatus(orderId, status);

        return "Order status updated.";

    }

}