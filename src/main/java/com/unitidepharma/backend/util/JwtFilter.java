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
        // ALWAYS ALLOW CORS PREFLIGHT
        // ==========================================
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ==========================================
        // PUBLIC AUTH ROUTES
        // ==========================================
        if (path.startsWith("/api/auth/")) {
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

        try {

            String header = request.getHeader("Authorization");

            // No JWT
            if (header == null || !header.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = header.substring(7);

            // Invalid JWT
            if (!jwtUtil.isTokenValid(token)) {
                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtUtil.extractEmail(token);

            User user = userRepository
                    .findByEmailIgnoreCase(email)
                    .orElse(null);

            if (user == null) {
                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

            if (!user.isActive()) {
                SecurityContextHolder.clearContext();
                filterChain.doFilter(request, response);
                return;
            }

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

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        } catch (JwtException e) {

            SecurityContextHolder.clearContext();

        } catch (Exception e) {

            SecurityContextHolder.clearContext();

        }

        filterChain.doFilter(request, response);
    }
}