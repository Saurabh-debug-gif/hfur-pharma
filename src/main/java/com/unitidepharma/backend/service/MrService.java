package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.CreateMrRequest;
import com.unitidepharma.backend.entity.Role;
import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MrService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public String createMr(CreateMrRequest request) {

        String email = request.getEmail().toLowerCase();

        // ✅ check existing
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException("MR already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.MR); // 🔥 KEY PART
        user.setArea(request.getArea()); // optional

        userRepository.save(user);

        return "✅ MR created successfully";
    }
    public List<User> getAllMRs(){

        return userRepository.findAll()

                .stream()

                .filter(user -> user.getRole()==Role.MR)

                .toList();

    }

}