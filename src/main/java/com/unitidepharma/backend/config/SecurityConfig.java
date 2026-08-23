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
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

                // ==========================================
                // CSRF
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

                        // CORS
                        .requestMatchers(
                                org.springframework.http.HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Public pages
                        .requestMatchers(
                                "/",
                                "/home",
                                "/login",
                                "/register",
                                "/medicines",
                                "/medicine/**"
                        ).permitAll()

                        // Static resources
                        .requestMatchers(
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/icons/**",
                                "/webjars/**",
                                "/favicon.ico"
                        ).permitAll()

                        // ==================================
                        // PUBLIC AUTH API
                        // ==================================
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // ==================================
                        // PUBLIC APIs
                        // ==================================
                        .requestMatchers(
                                "/api/public/**"
                        ).permitAll()

                        // ==================================
                        // PROTECTED APIs
                        // ==================================
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/customer/**"
                        ).hasRole("CUSTOMER")

                        .requestMatchers(
                                "/api/mr/**"
                        ).hasRole("MR")

                        // Everything else
                        .anyRequest().authenticated()
                )

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .logout(logout -> logout.disable());

        // JWT filter
        http.addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}