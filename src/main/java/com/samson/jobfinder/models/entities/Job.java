package com.samson.jobfinder.models.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private JobCategory category;

    private int likes;
    private int dislikes;
}
