package com.samson.jobfinder.controllers;

import com.samson.jobfinder.models.dtos.JobDto;
import com.samson.jobfinder.models.requests.AddNewJobRequest;
import com.samson.jobfinder.services.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobController {

    private final JobService jobService;

    @PostMapping
    @CrossOrigin(origins = "*")
    public ResponseEntity<JobDto> addNewJob(@RequestBody AddNewJobRequest request) throws Exception {
        log.trace("Inside JobController addNewJob");
        return ResponseEntity.ok(jobService.addNewJob(request));
    }

    @GetMapping
    @CrossOrigin(origins = "*")
    public Page<JobDto> fetchJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String categoryName
    ) {
        System.out.println("Keyword value = " + keyword);
        //System.out.println("Keyword class = " + keyword.getClass().getName());
        Pageable pageable = PageRequest.of(page, size);
        return jobService.fetchJobs(pageable, keyword, categoryName);
    }

}





