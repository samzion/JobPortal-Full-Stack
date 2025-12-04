package com.samson.jobfinder.services;

import com.samson.jobfinder.models.dtos.JobDto;
import com.samson.jobfinder.models.entities.Job;
import com.samson.jobfinder.models.entities.JobCategory;
import com.samson.jobfinder.models.requests.AddNewJobRequest;
import com.samson.jobfinder.repositories.JobCategoryRepository;
import com.samson.jobfinder.repositories.JobRepository;
import com.samson.jobfinder.repositories.JobVoteRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
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
        if(categoryOptional.isPresent()){
            job.setCategory(categoryOptional.get());
            job = jobRepository.save(job);
            return new JobDto(job.getId(), job.getTitle(), job.getDescription(), job.getCategory().getId());
        } else {
            throw new Exception("Invalid category parameter");
        }
    }
}
