package com.samson.jobfinder.services;

import com.samson.jobfinder.models.entities.Job;
import com.samson.jobfinder.models.entities.JobApplication;
import com.samson.jobfinder.models.entities.User;
import com.samson.jobfinder.models.enums.ApplicationStatus;
import com.samson.jobfinder.models.requests.JobApplicationRequest;
import com.samson.jobfinder.models.responses.JobApplicationResponse;
import com.samson.jobfinder.repositories.JobApplicationRepository;
import com.samson.jobfinder.repositories.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;

    public JobApplicationResponse applyForJob(Long jobId, User user, JobApplicationRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (jobApplicationRepository.existsByJobIdAndUserId(jobId, user.getId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .user(user)
                .coverLetter(request.getCoverLetter())
                .resumeUrl(request.getResumeUrl())
                .status(ApplicationStatus.PENDING)
                .build();

        JobApplication savedApplication = jobApplicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    public Page<JobApplicationResponse> getApplicationsByUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdOn").descending());
        Page<JobApplication> applications = jobApplicationRepository.findApplicationsByUser(user.getId(), pageable);
        
        return applications.map(this::mapToResponse);
    }

    public Page<JobApplicationResponse> getApplicationsByCompany(User company, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdOn").descending());
        Page<JobApplication> applications = jobApplicationRepository.findApplicationsByCompany(company.getId(), pageable);
        
        return applications.map(this::mapToResponse);
    }

    public JobApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatus status, User company) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getPostedBy().getId().equals(company.getId())) {
            throw new RuntimeException("You can only update applications for your own jobs");
        }

        application.setStatus(status);
        JobApplication updatedApplication = jobApplicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .companyName(application.getJob().getCompany())
                .applicantName(application.getUser().getFirstName() + " " + application.getUser().getLastName())
                .applicantEmail(application.getUser().getEmail())
                .coverLetter(application.getCoverLetter())
                .resumeUrl(application.getResumeUrl())
                .status(application.getStatus())
                .createdOn(application.getCreatedOn())
                .updatedOn(application.getUpdatedOn())
                .build();
    }
}