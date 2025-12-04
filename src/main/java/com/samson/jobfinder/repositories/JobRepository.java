package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;

public interface JobRepository extends JpaRepository<Job, Long> {
    @Query("SELECT j FROM Job j " +
            "WHERE (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:category IS NULL OR LOWER(j.category.name) = LOWER(:category))")
    Page<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("category") String category,
                         Pageable pageable);
}
