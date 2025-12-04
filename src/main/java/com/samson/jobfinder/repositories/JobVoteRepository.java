package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.JobVote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobVoteRepository extends JpaRepository<JobVote, Long> {
}
