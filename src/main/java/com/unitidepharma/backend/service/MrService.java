package com.unitidepharma.backend.service;

import com.unitidepharma.backend.dto.CreateMrRequest;
import com.unitidepharma.backend.dto.MrResponse;
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

        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("MR name is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("MR email is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new IllegalArgumentException("MR password must contain at least 8 characters");
        }

        String email = request.getEmail().trim().toLowerCase();

        // ✅ check existing
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException("MR already exists");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.MR); // 🔥 KEY PART
        user.setArea(request.getArea() == null ? null : request.getArea().trim());
        user.setActive(true);

        userRepository.save(user);

        return "✅ MR created successfully";
    }
    public List<MrResponse> getAllMRs(){
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole()==Role.MR)
                .map(this::toResponse)
                .toList();
    }

    public MrResponse updateStatus(Long mrId, boolean active) {
        User mr = getMr(mrId);
        mr.setActive(active);
        return toResponse(userRepository.save(mr));
    }

    private User getMr(Long mrId) {
        User user = userRepository.findById(mrId)
                .orElseThrow(() -> new RuntimeException("MR not found"));

        if (user.getRole() != Role.MR) {
            throw new IllegalArgumentException("Selected user is not an MR");
        }
        return user;
    }

    private MrResponse toResponse(User mr) {
        return new MrResponse(
                mr.getId(),
                mr.getName(),
                mr.getEmail(),
                mr.getArea(),
                mr.isActive(),
                mr.getCreatedAt()
        );
    }
}
