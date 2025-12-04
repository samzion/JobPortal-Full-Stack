package com.samson.jobfinder.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name = "job_votes")
public class JobVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Many votes belong to one job
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "visitor_id", nullable = false)
    private String visitorId;

    @Column(name="likes")
    private int likes;

    @Column(name="dislikes")
    private int dislikes;

}
