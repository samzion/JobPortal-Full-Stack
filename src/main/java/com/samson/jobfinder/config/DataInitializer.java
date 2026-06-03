package com.samson.jobfinder.config;

import com.samson.jobfinder.models.entities.JobCategory;
import com.samson.jobfinder.repositories.JobCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final JobCategoryRepository jobCategoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (jobCategoryRepository.count() == 0) {
            // Initialize job categories
            jobCategoryRepository.save(JobCategory.builder().name("Technology").build());
            jobCategoryRepository.save(JobCategory.builder().name("Marketing").build());
            jobCategoryRepository.save(JobCategory.builder().name("Sales").build());
            jobCategoryRepository.save(JobCategory.builder().name("Finance").build());
            jobCategoryRepository.save(JobCategory.builder().name("Human Resources").build());
            jobCategoryRepository.save(JobCategory.builder().name("Operations").build());
            jobCategoryRepository.save(JobCategory.builder().name("Customer Service").build());
            jobCategoryRepository.save(JobCategory.builder().name("Design").build());
            jobCategoryRepository.save(JobCategory.builder().name("Healthcare").build());
            jobCategoryRepository.save(JobCategory.builder().name("Education").build());
        }
    }
}