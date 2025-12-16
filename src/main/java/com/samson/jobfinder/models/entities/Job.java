package com.samson.jobfinder.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    @Column(name= "description",columnDefinition = "text")
    private String description;

    @Column(name= "title",columnDefinition = "varchar(100)")
    private String title;

    @Column(name="company",columnDefinition = "varchar(100)")
    private String company;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private JobCategory category;

    @Column(name= "created_on")
    private LocalDateTime createOn;
    @Column(name= "updated_on")
    private LocalDateTime updatedOn;
}
