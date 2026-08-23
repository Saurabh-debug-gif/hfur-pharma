package com.unitidepharma.backend.config;

import com.unitidepharma.backend.util.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                // ==========================================
                // DISABLE CSRF
                // ==========================================
                .csrf(csrf -> csrf.disable())

                // ==========================================
                // CORS
                // ==========================================
                .cors(Customizer.withDefaults())

                // ==========================================
                // STATELESS JWT
                // ==========================================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ==========================================
                // AUTHORIZATION
                // ==========================================
                .authorizeHttpRequests(auth -> auth

                        // ----------------------------------
                        // PUBLIC AUTH APIs
                        // ----------------------------------
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // ----------------------------------
                        // PUBLIC APIs
                        // ----------------------------------
                        .requestMatchers(
                                "/api/public/**"
                        ).permitAll()

                        // ----------------------------------
                        // PUBLIC PAGES
                        // ----------------------------------
                        .requestMatchers(
                                "/",
                                "/home",
                                "/login",
                                "/register",
                                "/medicines",
                                "/medicine/**"
                        ).permitAll()

                        // ----------------------------------
                        // STATIC FILES
                        // ----------------------------------
                        .requestMatchers(
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/icons/**",
                                "/webjars/**",
                                "/favicon.ico"
                        ).permitAll()

                        // ==================================
                        // TEMPORARY TEST
                        // ==================================
                        // EVERYTHING IS PUBLIC FOR NOW.
                        //
                        // This is ONLY to determine whether
                        // Spring Security authorization is
                        // causing the 403.
                        // ==================================
                        .anyRequest().permitAll()
                )

                // ==========================================
                // DISABLE DEFAULT LOGIN
                // ==========================================
                .formLogin(form -> form.disable())

                // ==========================================
                // DISABLE HTTP BASIC
                // ==========================================
                .httpBasic(basic -> basic.disable())

                // ==========================================
                // DISABLE LOGOUT
                // ==========================================
                .logout(logout -> logout.disable());

        // ==========================================
        // JWT FILTER
        // ==========================================
        http.addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}