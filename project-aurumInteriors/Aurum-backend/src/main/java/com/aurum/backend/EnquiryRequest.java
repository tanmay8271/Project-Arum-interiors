package com.aurum.backend;

import jakarta.validation.constraints.*;

/** Shape of the JSON sent by the website's contact form (field names match the HTML). */
public record EnquiryRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 150) String email,
        @Size(max = 20) @Pattern(regexp = "^[0-9+()\\-\\s]*$", message = "must contain only digits and + - ( )") String phone,
        @Size(max = 30) String projectType,
        @NotBlank @Size(min = 10, max = 2000) String message
) {}
