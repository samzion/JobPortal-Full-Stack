package com.samson.jobfinder.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "categories")
public class JobCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="name", nullable = false, unique = true, length = 100)
    private String name;

    // One category has many jobs
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Job> jobs = new ArrayList<>();
}
