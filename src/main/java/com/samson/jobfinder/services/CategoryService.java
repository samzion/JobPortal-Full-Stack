package com.samson.jobfinder.services;

import com.samson.jobfinder.models.entities.JobCategory;
import com.samson.jobfinder.repositories.JobCategoryRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Setter
@Getter
public class CategoryService {

    private final JobCategoryRepository jobCategoryRepository;

    public List<JobCategory> getAllCategories() {
        return jobCategoryRepository.findAll();
    }
}
