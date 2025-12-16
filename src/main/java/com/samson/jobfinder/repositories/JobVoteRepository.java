package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.JobVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobVoteRepository extends JpaRepository<JobVote, Long> {
}
