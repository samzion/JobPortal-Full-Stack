package com.samson.jobfinder.services;

import com.samson.jobfinder.exceptions.CategoryNotFoundException;
import com.samson.jobfinder.exceptions.DuplicateJobException;
import com.samson.jobfinder.exceptions.InvalidSortException;
import com.samson.jobfinder.exceptions.JobNotFoundException;
import com.samson.jobfinder.models.entities.User;
import com.samson.jobfinder.models.enums.SortBy;
import com.samson.jobfinder.models.entities.Job;
import com.samson.jobfinder.models.entities.JobCategory;
import com.samson.jobfinder.models.requests.AddNewJobRequest;
import com.samson.jobfinder.models.responses.AddNewJobResponse;
import com.samson.jobfinder.models.responses.FetchJobResponse;
import com.samson.jobfinder.repositories.JobCategoryRepository;
import com.samson.jobfinder.repositories.JobRepository;
import com.samson.jobfinder.repositories.JobWithVoteSummaryProjection;
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
    private final JobCategoryRepository jobCategoryRepository;

    public AddNewJobResponse addNewJob(AddNewJobRequest request, User user) {
        if (jobRepository.existsByTitleAndCompany(
                request.getTitle(), request.getCompany())) {
            throw new DuplicateJobException();
        }

        JobCategory category = jobCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .company(request.getCompany())
                .location(request.getLocation())
                .salaryRange(request.getSalaryRange())
                .category(category)
                .postedBy(user)
                .build();

        return new AddNewJobResponse(jobRepository.save(job));
    }

    public Page<FetchJobResponse> fetchJobs(
            int page,
            int size,
            String sortBy,
            String keyword,
            Integer categoryId,
            String visitorId,
            User user
    ) {
        SortBy safeSortBy;

        try {
            safeSortBy = (sortBy == null || sortBy.isBlank())
                    ? SortBy.CREATED_ON
                    : SortBy.valueOf(sortBy.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidSortException(sortBy);
        }

        if (categoryId != null &&
                !jobCategoryRepository.existsById(categoryId)) {
            throw new CategoryNotFoundException(categoryId);
        }

        Sort sort = switch (safeSortBy) {
            case LIKES -> Sort.by("likes").descending();
            case TITLE -> Sort.by("title").ascending();
            default -> Sort.by("createdOn").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);

        // If user is in company mode, show only their jobs
        if (user != null && user.getRole().name().equals("COMPANY") && user.getIsCompanyMode()) {
            return jobRepository.findJobsByPostedBy(user.getId(), keyword, categoryId, pageable)
                    .map(this::mapJobToResponse);
        }

        return jobRepository
                .searchJobsWithFilters(keyword, categoryId, visitorId, pageable)
                .map(this::map);
    }

    public FetchJobResponse getJob(Long jobId, String visitorId, User user) {
        JobWithVoteSummaryProjection p =
                Optional.ofNullable(jobRepository.getJobWithVoteSummary(jobId, visitorId))
                        .orElseThrow(() -> new JobNotFoundException(jobId));
        return new FetchJobResponse(p);
    }

    public FetchJobResponse updateJob(Long jobId, AddNewJobRequest request, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException(jobId));

        if (!job.getPostedBy().getId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own jobs");
        }

        JobCategory category = jobCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalaryRange(request.getSalaryRange());
        job.setCategory(category);

        Job savedJob = jobRepository.save(job);
        return mapJobToResponse(savedJob);
    }

    public void deleteJob(Long jobId, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException(jobId));

        if (!job.getPostedBy().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own jobs");
        }

        jobRepository.delete(job);
    }

    private FetchJobResponse mapJobToResponse(Job job) {
        FetchJobResponse response = new FetchJobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setCompany(job.getCompany());
        response.setLocation(job.getLocation());
        response.setSalaryRange(job.getSalaryRange());
        response.setCategoryId(job.getCategory().getId().longValue());
        response.setCategoryName(job.getCategory().getName());
        response.setCreatedOn(job.getCreatedOn());
        response.setUpdatedOn(job.getUpdatedOn());
        return response;
    }

    public FetchJobResponse map(JobWithVoteSummaryProjection p) {
        FetchJobResponse fetchJobResponse = new FetchJobResponse();
        fetchJobResponse.setId(p.getJobId());
        fetchJobResponse.setTitle(p.getTitle());
        fetchJobResponse.setDescription(p.getDescription());
        fetchJobResponse.setCategoryId(p.getCategoryId());
        fetchJobResponse.setLikes(p.getLikes());
        fetchJobResponse.setDislikes(p.getDislikes());
        fetchJobResponse.setVisitorVoteType(p.getVisitorVoteType());
        fetchJobResponse.setCreatedOn(p.getCreatedOn());
        fetchJobResponse.setCompany(p.getCompany());
        return fetchJobResponse;
    }
}
