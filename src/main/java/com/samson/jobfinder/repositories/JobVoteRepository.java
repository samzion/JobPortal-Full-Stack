package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.JobVote;
import com.samson.jobfinder.models.enums.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobVoteRepository extends JpaRepository<JobVote, Long> {
    Optional<JobVote> findByJob_IdAndVisitorId(Long jobId, String visitorId);
    int countByJob_IdAndVoteType(Long jobId, VoteType voteType);
}
