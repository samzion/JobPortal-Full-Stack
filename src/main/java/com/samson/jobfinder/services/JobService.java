package com.samson.jobfinder.services;

import com.samson.jobfinder.models.enums.SortBy;
import com.samson.jobfinder.models.enums.VoteType;
import com.samson.jobfinder.models.dtos.JobDto;
import com.samson.jobfinder.models.entities.Job;
import com.samson.jobfinder.models.entities.JobCategory;
import com.samson.jobfinder.models.entities.JobVote;
import com.samson.jobfinder.models.requests.AddNewJobRequest;
import com.samson.jobfinder.repositories.JobCategoryRepository;
import com.samson.jobfinder.repositories.JobRepository;
import com.samson.jobfinder.repositories.JobVoteRepository;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final JobVoteRepository jobVoteRepository;
    private final JobCategoryRepository jobCategoryRepository;


    public JobDto addNewJob(AddNewJobRequest request) throws Exception {
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());

        Optional<JobCategory> categoryOptional = jobCategoryRepository.findById(request.getCategoryId());
        if (categoryOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid category parameter");
        }

        job.setCategory(categoryOptional.get());
        job.setCompany(request.getCompany());
        job = jobRepository.save(job);

        return new JobDto(job);
    }


    // 🔥 PAGINATED FETCH
    public Page<JobDto> fetchJobs(Pageable pageable) {
        return jobRepository.findAll(pageable)
                .map(job -> new JobDto(job));
    }

    public Page<JobDto> fetchJobs(
            int page,
            int size,
            @Nullable String sortBy,
            @Nullable String keyword,
            @Nullable String categoryName,
            @Nullable String visitorId
    ) {
        String safeKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();
        SortBy safeSortBy; //can only be  date, likes or title
        Integer categoryId = null;
        Page<Job> jobsPage;
        Sort sort = Sort.by("createdOn").descending();

        try {
            safeSortBy = (sortBy == null || sortBy.isBlank()) ? SortBy.date : SortBy.valueOf(sortBy.trim());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid sortBy value: " + sortBy, e);
        }


        if (categoryName != null && !categoryName.isBlank()) {
            JobCategory category = jobCategoryRepository.findByNameIgnoreCase(categoryName)
                    .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryName));
            categoryId = category.getId();
        }


        if (safeSortBy == SortBy.likes){
            sort = Sort.by("likes").descending();
        } else if (safeSortBy == SortBy.title) {
            sort = Sort.by("title").ascending();
        }
        Pageable pageable = PageRequest.of(page, size, sort);
        System.out.println("Entering job repository");
        if (safeKeyword == null && categoryId == null) {
            jobsPage = jobRepository.findAll(pageable);
        } else if (safeKeyword == null) {
            jobsPage = jobRepository.findByCategoryId(categoryId, pageable);
        } else {
            jobsPage = jobRepository.searchJobs(safeKeyword, categoryId, pageable);
        }
        return jobsPage.map(job -> this.mapJobToDtoWithVoteStatus(job, visitorId));
    }

    private JobDto mapJobToDtoWithVoteStatus(Job job, @Nullable String visitorId) {
        String visitorVoteStatus = null;

        if (visitorId != null && !visitorId.isBlank()) {
            Optional<JobVote> voteOptional = jobVoteRepository.findByJob_IdAndVisitorId(job.getId(), visitorId);

            // e.g., "LIKE", "DISLIKE"
            visitorVoteStatus = voteOptional.map(jobVote -> jobVote.getVoteType().name()).orElse(null); // No vote status
        }
        return new JobDto(job, visitorVoteStatus);
    }

    @Transactional
    public JobDto handleVoteAction(Long jobId, String visitorId, VoteType intendedVoteType) {

        // 1. Fetch Job and existing Vote (or create a placeholder for a first-time voter)
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new EntityNotFoundException("Job not found."));

        // Use the corrected repository method (JobVoteRepository must return Optional)
        Job finalJob = job;
        JobVote vote = jobVoteRepository.findByJob_IdAndVisitorId(jobId, visitorId)
                // orElseGet: If vote doesn't exist, create a new transient record starting at NONE.
                .orElseGet(() -> new JobVote(null, finalJob, visitorId, VoteType.NONE));

        VoteType currentVoteType = vote.getVoteType();
        VoteType newVoteType;

        // 2. CORE VOTING LOGIC: Determine the final state
        if (intendedVoteType == currentVoteType) {
            // SCENARIO 1: UNDO (Clicking the same button twice)
            newVoteType = VoteType.NONE;

        } else {
            // SCENARIO 2 & 3: NEW VOTE (from NONE) or SWITCH VOTE (from opposite)
            newVoteType = intendedVoteType;
        }

        // 3. APPLY COUNTER CHANGES (Using Entity Helper Methods)

        // Step A: Undo the old vote (if any)
        if (currentVoteType == VoteType.LIKE) {
            job.decrementLikes();
        } else if (currentVoteType == VoteType.DISLIKE) {
            job.decrementDislikes();
        }

        // Step B: Apply the new vote (if not NONE)
        if (newVoteType == VoteType.LIKE) {
            job.incrementLikes();
        } else if (newVoteType == VoteType.DISLIKE) {
            job.incrementDislikes();
        }
        //

        // 4. Save/Delete Vote Record
        vote.setVoteType(newVoteType);

        if (newVoteType == VoteType.NONE && vote.getId() != null) {
            // Delete record if the user retracts the vote
            jobVoteRepository.delete(vote);
        } else if (newVoteType != VoteType.NONE) {
            // Save/Update the vote record
            jobVoteRepository.save(vote);
        }

        job = jobRepository.save(job);
        String updatedStatus = (newVoteType == VoteType.NONE) ? null : newVoteType.name();

        return new JobDto(job, updatedStatus);
    }

    public JobDto getJob(@NonNull Long jobId) {
        Job job =  jobRepository.findById(jobId).get();
        return new JobDto(job);

    }
}
