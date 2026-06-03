package com.samson.jobfinder.controllers;

import com.samson.jobfinder.models.entities.User;
import com.samson.jobfinder.models.enums.ApplicationStatus;
import com.samson.jobfinder.models.requests.JobApplicationRequest;
import com.samson.jobfinder.models.responses.JobApplicationResponse;
import com.samson.jobfinder.services.JobApplicationService;
import com.samson.jobfinder.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;
    private final UserService userService;

    @PostMapping("/jobs/{jobId}")
    public ResponseEntity<JobApplicationResponse> applyForJob(
            @PathVariable Long jobId,
            @RequestBody JobApplicationRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication.getName());
        JobApplicationResponse response = jobApplicationService.applyForJob(jobId, user, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<Page<JobApplicationResponse>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication.getName());
        Page<JobApplicationResponse> applications = jobApplicationService.getApplicationsByUser(user, page, size);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/company-applications")
    public ResponseEntity<Page<JobApplicationResponse>> getCompanyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication.getName());
        Page<JobApplicationResponse> applications = jobApplicationService.getApplicationsByCompany(user, page, size);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<JobApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication.getName());
        JobApplicationResponse response = jobApplicationService.updateApplicationStatus(applicationId, status, user);
        return ResponseEntity.ok(response);
    }
}