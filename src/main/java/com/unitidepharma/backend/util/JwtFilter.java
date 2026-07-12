package com.unitidepharma.backend.util;

import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip public endpoints
        if (!path.startsWith("/api/")
                || path.startsWith("/api/auth/")
                || path.startsWith("/api/public/")) {

            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("\n========== JWT FILTER ==========");
        System.out.println("URI = " + path);

        String header = request.getHeader("Authorization");

        System.out.println("AUTH HEADER = " + header);

        if (header == null || !header.startsWith("Bearer ")) {

            System.out.println("Authorization header missing.");

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Missing Authorization Header");
            return;
        }

        String token = header.substring(7);

        try {

            System.out.println("TOKEN = " + token);

            if (!jwtUtil.isTokenValid(token)) {

                System.out.println("Token Invalid");

                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("Invalid Token");
                return;
            }

            String email = jwtUtil.extractEmail(token);

            System.out.println("EMAIL = " + email);

            User user = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("ROLE = " + user.getRole());

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + user.getRole().name()
                                    )
                            )
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("Authentication Success");

            filterChain.doFilter(request, response);

        }

        catch (JwtException e) {

            System.out.println("JWT ERROR");
            e.printStackTrace();

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("JWT Error : " + e.getMessage());

        }

        catch (Exception e) {

            System.out.println("GENERAL ERROR");
            e.printStackTrace();

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("General Error : " + e.getMessage());

        }

    }

}