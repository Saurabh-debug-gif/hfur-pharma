package com.unitidepharma.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", "dp4qv8lke",
                "api_key", "161951358638731",
                "api_secret", "EVvFCpHf-hmo69n_0i4Y7IyM1LQ"
        ));
    }
}