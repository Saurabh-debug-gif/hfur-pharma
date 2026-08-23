package com.unitidepharma.backend.controller;

import com.unitidepharma.backend.dto.AuthResponse;
import com.unitidepharma.backend.dto.LoginRequest;
import com.unitidepharma.backend.dto.RegisterRequest;
import com.unitidepharma.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {

            System.out.println("========== REGISTER REQUEST ==========");
            System.out.println("Name: " + request.getName());
            System.out.println("Email: " + request.getEmail());
            System.out.println("Role: " + request.getRole());

            AuthResponse response = authService.register(request);

            System.out.println("========== REGISTER SUCCESS ==========");

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            System.out.println("========== REGISTER ERROR ==========");
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);

    }

}
