package com.aurum.backend;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final EnquiryRepository repository;

    public ContactController(EnquiryRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody EnquiryRequest req) {
        repository.save(new Enquiry(
                req.name().trim(),
                req.email().trim(),
                req.phone() == null ? null : req.phone().trim(),
                req.projectType(),
                req.message().trim()));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", "received"));
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
