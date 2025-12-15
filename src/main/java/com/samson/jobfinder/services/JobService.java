package com.samson.jobfinder.services;

import com.samson.jobfinder.models.dtos.JobDto;
import com.samson.jobfinder.models.entities.Job;
import com.samson.jobfinder.models.entities.JobCategory;
import com.samson.jobfinder.models.requests.AddNewJobRequest;
import com.samson.jobfinder.repositories.JobCategoryRepository;
import com.samson.jobfinder.repositories.JobRepository;
import com.samson.jobfinder.repositories.JobVoteRepository;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

        return new JobDto(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getCompany(),
                job.getCategory().getId()
        );
    }


    // 🔥 PAGINATED FETCH
    public Page<JobDto> fetchJobs(Pageable pageable) {
        return jobRepository.findAll(pageable)
                .map(job -> new JobDto(
                        job.getId(),
                        job.getTitle(),
                        job.getDescription(),
                        job.getCompany(),
                        job.getCategory().getId()
                ));
    }

    public Page<JobDto> fetchJobs(
            Pageable pageable,
            @Nullable String keyword,
            @Nullable String categoryName
    ) {
        String safeKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        Integer categoryId = null;
        if (categoryName != null && !categoryName.isBlank()) {
            Optional<JobCategory> categoryOptional = Optional.of(jobCategoryRepository.findByNameIgnoreCase(categoryName).orElseThrow());
            categoryId = categoryOptional.get().getId();
        }
        System.out.println("Entering job repository");
        Page<Job> jobsPage;
        if (safeKeyword == null && categoryId == null){
            jobsPage =jobRepository.findAll(pageable);
        } else if(safeKeyword == null && !(categoryId == null)) {
            jobsPage =jobRepository.findByCategoryId(categoryId, pageable);
        } else {
                jobsPage = jobRepository.searchJobs(safeKeyword, categoryId, pageable);
            }
        return jobsPage.map(job -> new JobDto(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getCompany(),
                job.getCategory().getId()
        ));
    }
}
