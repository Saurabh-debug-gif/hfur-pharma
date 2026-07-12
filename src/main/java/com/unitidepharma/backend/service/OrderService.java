package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.OrderPlacedResponse;
import com.unitidepharma.backend.entity.*;
import com.unitidepharma.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    // Same WhatsApp business number already used in navbar/footer/login
    private static final String WHATSAPP_NUMBER = "918693030619";

    // ✅ PLACE ORDER
    // Simplified to work exactly like the Enquiry flow: no stock checks,
    // no stock deduction, nothing that can throw a 500 mid-way. We just
    // record the order for the admin dashboard and push every medicine
    // detail (except the image) straight to WhatsApp.
    @Transactional
    public OrderPlacedResponse placeOrder(String email) {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0;

        // ✅ CREATE ORDER
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order = orderRepository.save(order);

        // ✅ Build WhatsApp order-summary message alongside processing the cart
        StringBuilder whatsappText = new StringBuilder();
        whatsappText.append("New Order Received\n");
        whatsappText.append("Order ID: ").append(order.getId()).append("\n");
        whatsappText.append("Customer: ").append(user.getName())
                .append(" (").append(user.getEmail()).append(")\n");
        if (user.getPhone() != null) {
            whatsappText.append("Phone: ").append(user.getPhone()).append("\n");
        }
        if (user.getArea() != null) {
            whatsappText.append("Area: ").append(user.getArea()).append("\n");
        }
        whatsappText.append("Items:\n");

        // ✅ PROCESS CART — no stock check, no stock deduction.
        for (CartItem cartItem : cartItems) {

            Medicine medicine = cartItem.getMedicine();

            // ✅ Create order item (record only, stock is left untouched)
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMedicine(medicine);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(medicine.getPrice());

            orderItemRepository.save(orderItem);

            double lineTotal = medicine.getPrice() * cartItem.getQuantity();
            totalAmount += lineTotal;

            // ✅ Full medicine details to WhatsApp — everything except the image
            whatsappText.append("--------------------\n");
            whatsappText.append("Medicine: ").append(medicine.getName()).append("\n");
            whatsappText.append("Brand: ").append(medicine.getBrand()).append("\n");

            if (medicine.getCategory() != null) {
                whatsappText.append("Category: ").append(medicine.getCategory().getName()).append("\n");
            }

            if (medicine.getDescription() != null && !medicine.getDescription().isBlank()) {
                whatsappText.append("Description: ").append(medicine.getDescription()).append("\n");
            }

            whatsappText.append("Price: Rs.").append(medicine.getPrice()).append("\n");
            whatsappText.append("Quantity: ").append(cartItem.getQuantity()).append("\n");
            whatsappText.append("Subtotal: Rs.").append(lineTotal).append("\n");
        }

        whatsappText.append("--------------------\n");
        whatsappText.append("Total: Rs.").append(totalAmount);

        // ✅ Update total
        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        // ✅ Clear cart
        cartItemRepository.deleteAll(cartItems);

        // ✅ Build WhatsApp deep link (opens on the customer's device, pre-filled;
        //     they still need to tap Send — a free wa.me link cannot silently
        //     auto-send without WhatsApp Business API credentials)
        String encodedText = URLEncoder.encode(whatsappText.toString(), StandardCharsets.UTF_8);
        String whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodedText;

        return new OrderPlacedResponse(
                "✅ Order placed successfully. Order ID: " + order.getId(),
                order.getId(),
                totalAmount,
                whatsappUrl
        );
    }

    // ✅ UPDATE STATUS (ADMIN)
    public void updateStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus newStatus;

        try {
            newStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid status");
        }

        // 🔥 VALID TRANSITIONS
        if (!isValidTransition(order.getStatus(), newStatus)) {
            throw new RuntimeException("Invalid status transition");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
    }


    public List<Order> getOrders(String email){

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserId(user.getId());

    }
    public List<Order> getAllOrders(){

        return orderRepository.findAll();

    }
    // 🔥 TRANSITION RULES
    private boolean isValidTransition(OrderStatus current, OrderStatus next) {

        return switch (current) {
            case PENDING -> next == OrderStatus.CONFIRMED;
            case CONFIRMED -> next == OrderStatus.DISPATCHED;
            case DISPATCHED -> next == OrderStatus.DELIVERED;
            case DELIVERED -> false;
        };
    }
}