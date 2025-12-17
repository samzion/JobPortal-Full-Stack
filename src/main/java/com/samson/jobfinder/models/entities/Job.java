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

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private JobCategory category;

    @Column(name= "likes", nullable = false)
    private int likes = 0; // Initialize

    @Column(name= "dislikes", nullable = false)
    private int dislikes = 0; // Initialize

    @Column(name= "created_on", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createOn;

    @Column(name= "updated_on", nullable = false)
    @UpdateTimestamp // Update automatically on every save/flush
    private LocalDateTime updatedOn;

    public void incrementLikes() {
        this.likes++;
    }

    public void decrementLikes() {
        if (this.likes > 0) {
            this.likes--;
        }
    }

    public void incrementDislikes() {
        this.dislikes++;
    }

    public void decrementDislikes() {
        if (this.dislikes > 0) {
            this.dislikes--;
        }
    }
}