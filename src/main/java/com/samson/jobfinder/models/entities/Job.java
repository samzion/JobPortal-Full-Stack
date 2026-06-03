package com.samson.jobfinder.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

    @Column(name="location")
    private String location;

    @Column(name="salary_range")
    private String salaryRange;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private JobCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by", nullable = false)
    private User postedBy;

    @Column(name= "created_on", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdOn;

    @Column(name= "updated_on", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedOn;
}