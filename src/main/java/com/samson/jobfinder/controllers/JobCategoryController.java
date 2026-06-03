package com.samson.jobfinder.controllers;

import com.samson.jobfinder.models.entities.JobCategory;
import com.samson.jobfinder.repositories.JobCategoryRepository;
import com.samson.jobfinder.services.CategoryService;
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

    private final CategoryService categoryService;

    @GetMapping("/categories")
    @CrossOrigin(origins = "*")
    public List<JobCategory> getAllCategories() {
        return categoryService.getAllCategories();
    }
}
