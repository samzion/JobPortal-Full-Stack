package com.samson.jobfinder.services;

import com.samson.jobfinder.models.entities.JobVote;
import com.samson.jobfinder.models.enums.VoteType;
import com.samson.jobfinder.models.responses.FetchJobResponse;
import com.samson.jobfinder.repositories.JobVoteRepository;
import com.samson.jobfinder.repositories.JobWithVoteSummaryProjection;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobVoteService {

    private final JobVoteRepository jobVoteRepository;
    private final JobService jobService;

    @Transactional
    public FetchJobResponse handleVoteAction(
            Long jobId,
            String visitorId,
            VoteType intendedVoteType
    ) {

        FetchJobResponse jobResponse =
                jobService.getJob(jobId, visitorId, null);

        VoteType currentVoteType =
                VoteType.valueOf(jobResponse.getVisitorVoteType());

        Optional<JobVote> existingVoteOpt =
                jobVoteRepository.findByJobIdAndVisitorId(jobId, visitorId);

        // CASE 1: No previous vote so CREATE
        if (currentVoteType == VoteType.NONE) {

            JobVote newVote = new JobVote();
            newVote.setJobId(jobId);
            newVote.setVisitorId(visitorId);
            newVote.setVoteType(intendedVoteType);
            jobVoteRepository.save(newVote);

            if (intendedVoteType == VoteType.LIKE) {
                jobResponse.setLikes(jobResponse.getLikes() + 1);
            } else {
                jobResponse.setDislikes(jobResponse.getDislikes() + 1);
            }

            jobResponse.setVisitorVoteType(intendedVoteType.name());
            return jobResponse;
        }

        // CASE 2: Same vote clicked again, REMOVE
        if (currentVoteType == intendedVoteType) {

            existingVoteOpt.ifPresent(jobVoteRepository::delete);

            if (currentVoteType == VoteType.LIKE) {
                jobResponse.setLikes(jobResponse.getLikes() - 1);
            } else {
                jobResponse.setDislikes(jobResponse.getDislikes() - 1);
            }

            jobResponse.setVisitorVoteType(VoteType.NONE.name());
            return jobResponse;
        }

        // CASE 3: Switch vote, UPDATE
        JobVote existingVote = existingVoteOpt
                .orElseThrow(() -> new IllegalStateException("Vote record missing"));

        existingVote.setVoteType(intendedVoteType);
        jobVoteRepository.save(existingVote);

        if (intendedVoteType == VoteType.LIKE) {
            jobResponse.setLikes(jobResponse.getLikes() + 1);
            jobResponse.setDislikes(jobResponse.getDislikes() - 1);
        } else {
            jobResponse.setLikes(jobResponse.getLikes() - 1);
            jobResponse.setDislikes(jobResponse.getDislikes() + 1);
        }

        jobResponse.setVisitorVoteType(intendedVoteType.name());
        return jobResponse;
    }

}
