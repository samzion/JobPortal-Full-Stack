package com.samson.jobfinder.repositories;

import java.time.LocalDateTime;

public interface JobWithVoteSummaryProjection {
    Long getJobId();
    String getTitle();
    String getDescription();
    Long getCategoryId();
    Long getLikes();
    Long getDislikes();
    String getVisitorVoteType();
    LocalDateTime getCreatedOn();
    String getCompany();
}
