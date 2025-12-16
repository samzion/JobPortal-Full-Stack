package com.samson.jobfinder.controllers;

import com.samson.jobfinder.models.entities.JobCategory;
import com.samson.jobfinder.repositories.JobCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class JobCategoryController {

    private final JobCategoryRepository jobCategoryRepository;

    @GetMapping("/categories")
    @CrossOrigin(origins = "*")
    public List<JobCategory> getAllCategories() {
        return jobCategoryRepository.findAll();
    }
}
