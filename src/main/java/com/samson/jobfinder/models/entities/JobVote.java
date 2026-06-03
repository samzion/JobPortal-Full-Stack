package com.samson.jobfinder.models.entities;

import com.samson.jobfinder.models.enums.VoteType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(name = "job_votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"job_id", "visitor_id"}, name = "uq_visitor_job_vote")
})
public class JobVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Many votes belong to one job

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(name = "visitor_id", nullable = false)
    private String visitorId;

    @Column(name="vote_type", nullable = false) // Added nullable=false for integrity
    @Enumerated(EnumType.STRING)
    private VoteType voteType;

    @Column(name= "created_on", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdOn;

    @Column(name= "updated_on", nullable = false)
    @UpdateTimestamp // Update automatically on every save/flush
    private LocalDateTime updatedOn;
}
