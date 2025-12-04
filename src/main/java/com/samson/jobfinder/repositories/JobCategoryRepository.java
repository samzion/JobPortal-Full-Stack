package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobCategoryRepository extends JpaRepository<JobCategory, Integer> {
}
