package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.AuthResponse;
import com.unitidepharma.backend.dto.LoginRequest;
import com.unitidepharma.backend.dto.RegisterRequest;
import com.unitidepharma.backend.entity.Role;
import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.repository.UserRepository;
import com.unitidepharma.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // =========================
    // REGISTER
    // =========================

    public AuthResponse register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Role role = Role.CUSTOMER;

        if (request.getRole() != null &&
                !request.getRole().isBlank() &&
                !Role.CUSTOMER.name().equalsIgnoreCase(request.getRole().trim())) {
            throw new RuntimeException("Public registration is available only for customers");
        }

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getName()
        );
    }

    // =========================
    // LOGIN
    // =========================

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Your account is inactive. Please contact the administrator");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getName()
        );
    }

}
