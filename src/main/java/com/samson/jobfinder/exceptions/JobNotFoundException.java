package com.samson.jobfinder.exceptions;

public class JobNotFoundException extends AppException {
    public JobNotFoundException(Long jobId) {
        super("Job not found with id: " + jobId);
    }
}
