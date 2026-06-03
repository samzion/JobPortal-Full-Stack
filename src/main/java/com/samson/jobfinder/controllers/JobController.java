package com.samson.jobfinder.controllers;

import com.samson.jobfinder.models.entities.User;
import com.samson.jobfinder.models.requests.AddNewJobRequest;
import com.samson.jobfinder.models.requests.VoteRequest;
import com.samson.jobfinder.models.responses.AddNewJobResponse;
import com.samson.jobfinder.models.responses.FetchJobResponse;
import com.samson.jobfinder.services.JobService;
import com.samson.jobfinder.services.JobVoteService;
import com.samson.jobfinder.services.UserService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Validated
@Slf4j
public class JobController {

    private final JobService jobService;
    private final JobVoteService jobVoteService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<AddNewJobResponse> addNewJob(
            @RequestBody AddNewJobRequest request,
            Authentication authentication) throws Exception {
        log.trace("Inside JobController addNewJob");
        User user = userService.getCurrentUser(authentication.getName());
        AddNewJobResponse response = jobService.addNewJob(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public Page<FetchJobResponse> fetchJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String sortBy,
            @RequestHeader(value = "X-Visitor-ID", required = false) String visitorId,
            Authentication authentication) {
        
        User user = null;
        if (authentication != null) {
            user = userService.getCurrentUser(authentication.getName());
        }
        
        return jobService.fetchJobs(page, size, sortBy, keyword, categoryId, visitorId, user);
    }

    @GetMapping("{jobId}")
    public ResponseEntity<FetchJobResponse> getJob(
            @PathVariable @Positive Long jobId,
            @RequestHeader(value = "X-Visitor-ID", required = false) String visitorId,
            Authentication authentication) {
        
        User user = null;
        if (authentication != null) {
            user = userService.getCurrentUser(authentication.getName());
        }
        
        FetchJobResponse jobResponse = jobService.getJob(jobId, visitorId, user);
        return ResponseEntity.ok(jobResponse);
    }

    @PutMapping("{jobId}")
    public ResponseEntity<FetchJobResponse> updateJob(
            @PathVariable Long jobId,
            @RequestBody AddNewJobRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication.getName());
        FetchJobResponse response = jobService.updateJob(jobId, request, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{jobId}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long jobId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication.getName());
        jobService.deleteJob(jobId, user);
        return ResponseEntity.ok("Job deleted successfully");
    }

    @PostMapping("{jobId}/vote")
    public ResponseEntity<FetchJobResponse> handleVoteAction(
            @PathVariable Long jobId,
            @RequestHeader(value = "X-Visitor-ID", required = false) String visitorId,
            @RequestBody @Validated VoteRequest request) {

        FetchJobResponse updatedJobWithVote = jobVoteService.handleVoteAction(jobId, visitorId, request.getVoteType());
        return ResponseEntity.ok(updatedJobWithVote);
    }
}





