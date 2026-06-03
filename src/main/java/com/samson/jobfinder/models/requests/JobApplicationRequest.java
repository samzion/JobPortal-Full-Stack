package com.samson.jobfinder.models.requests;

import lombok.Data;

@Data
public class JobApplicationRequest {
    private String coverLetter;
    private String resumeUrl;
}