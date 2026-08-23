package com.unitidepharma.backend.util;

import com.unitidepharma.backend.entity.User;
import com.unitidepharma.backend.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // ==========================================
        // DEBUG
        // ==========================================

        System.out.println(
                "JWT FILTER >>> " + method + " " + path
        );

        // ==========================================
        // CORS PREFLIGHT
        // ==========================================

        if ("OPTIONS".equalsIgnoreCase(method)) {

            System.out.println(
                    "JWT FILTER >>> OPTIONS ALLOWED"
            );

            filterChain.doFilter(request, response);
            return;
        }

        // ==========================================
        // PUBLIC AUTH ROUTES
        // ==========================================

        if (path.startsWith("/api/auth/")) {

            System.out.println(
                    "JWT FILTER >>> PUBLIC AUTH ALLOWED: " + path
            );

            filterChain.doFilter(request, response);
            return;
        }

        // ==========================================
        // OTHER PUBLIC ROUTES
        // ==========================================

        if (path.startsWith("/api/public/")
                || path.startsWith("/css/")
                || path.startsWith("/js/")
                || path.startsWith("/images/")
                || path.startsWith("/icons/")
                || path.startsWith("/webjars/")
                || path.equals("/")
                || path.equals("/home")
                || path.equals("/login")
                || path.equals("/register")
                || path.equals("/favicon.ico")) {

            filterChain.doFilter(request, response);
            return;
        }

        // ==========================================
        // JWT VALIDATION
        // ==========================================

        try {

            String header =
                    request.getHeader("Authorization");

            // No JWT
            if (header == null ||
                    !header.startsWith("Bearer ")) {

                System.out.println(
                        "JWT FILTER >>> NO TOKEN"
                );

                filterChain.doFilter(request, response);
                return;
            }

            String token = header.substring(7);

            // Invalid JWT
            if (!jwtUtil.isTokenValid(token)) {

                System.out.println(
                        "JWT FILTER >>> INVALID TOKEN"
                );

                SecurityContextHolder.clearContext();

                filterChain.doFilter(request, response);
                return;
            }

            String email =
                    jwtUtil.extractEmail(token);

            System.out.println(
                    "JWT FILTER >>> TOKEN EMAIL: " + email
            );

            User user = userRepository
                    .findByEmailIgnoreCase(email)
                    .orElse(null);

            if (user == null) {

                System.out.println(
                        "JWT FILTER >>> USER NOT FOUND"
                );

                SecurityContextHolder.clearContext();

                filterChain.doFilter(request, response);
                return;
            }

            if (!user.isActive()) {

                System.out.println(
                        "JWT FILTER >>> USER INACTIVE"
                );

                SecurityContextHolder.clearContext();

                filterChain.doFilter(request, response);
                return;
            }

            // ======================================
            // AUTHENTICATE USER
            // ======================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" +
                                                    user.getRole().name()
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "JWT FILTER >>> AUTHENTICATED: "
                            + user.getEmail()
                            + " ROLE=" + user.getRole().name()
            );

        } catch (JwtException e) {

            System.out.println(
                    "JWT FILTER >>> JWT ERROR: "
                            + e.getMessage()
            );

            SecurityContextHolder.clearContext();

        } catch (Exception e) {

            System.out.println(
                    "JWT FILTER >>> ERROR: "
                            + e.getMessage()
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}