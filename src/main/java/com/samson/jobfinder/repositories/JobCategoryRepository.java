package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobCategoryRepository extends JpaRepository<JobCategory, Integer> {
    Optional<JobCategory> findByNameIgnoreCase(String name);
}
