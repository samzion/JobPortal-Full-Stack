package com.samson.jobfinder.repositories;

import com.samson.jobfinder.models.entities.JobApplication;
import com.samson.jobfinder.models.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.postedBy.id = :companyId")
    Page<JobApplication> findApplicationsByCompany(@Param("companyId") Long companyId, Pageable pageable);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.user.id = :userId")
    Page<JobApplication> findApplicationsByUser(@Param("userId") Long userId, Pageable pageable);
    
    Optional<JobApplication> findByJobIdAndUserId(Long jobId, Long userId);
    
    boolean existsByJobIdAndUserId(Long jobId, Long userId);
    
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.job.id = :jobId")
    Long countApplicationsByJobId(@Param("jobId") Long jobId);
    
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.job.id = :jobId AND ja.status = :status")
    Long countApplicationsByJobIdAndStatus(@Param("jobId") Long jobId, @Param("status") ApplicationStatus status);
}