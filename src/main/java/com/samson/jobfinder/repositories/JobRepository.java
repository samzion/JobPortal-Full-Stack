package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.Job;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j " +
            "WHERE (:keyword IS NULL OR " +
            "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:categoryId IS NULL OR j.category.id = :categoryId)")
    Page<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("categoryId") Integer categoryId,
                         Pageable pageable);

    Page<Job> findByCategoryId(Integer categoryId, Pageable pageable);
}