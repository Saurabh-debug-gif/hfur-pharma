package com.unitidepharma.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ViewController {

    @GetMapping("/")
    public String home() {
        return "public/home";
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String register() {
        return "auth/register";
    }

    @GetMapping("/customer/dashboard")
    public String customerDashboard() {
        return "customer/dashboard";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/mr/dashboard")
    public String mrDashboard() {
        return "mr/dashboard";
    }

    @GetMapping("/medicines")
    public String medicines() {
        return "public/medicines";
    }

    @GetMapping("/medicine/{id}")
    public String medicineDetails(@PathVariable Long id) {
        return "public/medicine-detail";
    }

    @GetMapping("/customer/cart")
    public String cart() {
        return "customer/cart";
    }

    @GetMapping("/customer/orders")
    public String orders() {
        return "customer/orders";
    }

    @GetMapping("/admin/medicines")
    public String adminMedicines() {
        return "admin/medicines";
    }

    @GetMapping("/admin/orders")
    public String adminOrders() {
        return "admin/orders";
    }

    @GetMapping("/admin/mr")
    public String adminMr() {
        return "admin/mr";
    }

    @GetMapping("/admin/tracking/{mrId}")
    public String tracking(@PathVariable Long mrId) {
        return "admin/tracking";
    }

    @GetMapping("/admin/visits/{mrId}")
    public String visits(@PathVariable Long mrId) {
        return "admin/visits";
    }
}