package com.samson.jobfinder.controllers;

import com.samson.jobfinder.models.dtos.JobDto;
import com.samson.jobfinder.models.requests.AddNewJobRequest;
import com.samson.jobfinder.services.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<JobDto> addNewJob(@RequestBody AddNewJobRequest request) throws Exception {
        log.trace("Inside JobController addNewJob");
        return ResponseEntity.ok(jobService.addNewJob(request));
    }

}





