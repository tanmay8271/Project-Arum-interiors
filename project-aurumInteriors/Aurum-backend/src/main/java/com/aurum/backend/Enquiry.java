package com.aurum.backend;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "enquiries")
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "project_type", length = 30)
    private String projectType;

    @Column(nullable = false, length = 2000)
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Enquiry() {}

    public Enquiry(String name, String email, String phone, String projectType, String message) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.projectType = projectType;
        this.message = message;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getProjectType() { return projectType; }
    public String getMessage() { return message; }
    public Instant getCreatedAt() { return createdAt; }
}