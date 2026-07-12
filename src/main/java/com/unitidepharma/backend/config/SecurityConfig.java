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
                .csrf(csrf -> csrf.disable())

                .cors(Customizer.withDefaults())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // ==========================
                        // Public Pages
                        // ==========================
                        .requestMatchers(
                                "/",
                                "/home",
                                "/login",
                                "/register",
                                "/medicines",
                                "/medicine/**"
                        ).permitAll()

                        // ==========================
                        // Static Resources
                        // ==========================
                        .requestMatchers(
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/icons/**",
                                "/webjars/**",
                                "/favicon.ico"
                        ).permitAll()

                        // ==========================
                        // Public APIs
                        // ==========================
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/public/**"
                        ).permitAll()

                        // ==========================
                        .requestMatchers(
                                "/admin/**",
                                "/customer/**",
                                "/mr/**"
                        ).permitAll()
                        // ==========================
                        // Protected APIs
                        // ==========================
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/customer/**").hasRole("CUSTOMER")
                        .requestMatchers("/api/mr/**").hasRole("MR")

                        .anyRequest().authenticated()
                )

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .logout(logout -> logout.disable());

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}