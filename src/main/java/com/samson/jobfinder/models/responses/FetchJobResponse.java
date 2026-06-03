package com.samson.jobfinder.models.responses;

import com.samson.jobfinder.repositories.JobWithVoteSummaryProjection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FetchJobResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private String salaryRange;
    private Long categoryId;
    private String categoryName;
    private Long likes;
    private Long dislikes;
    private String visitorVoteType;
    private String userVote;
    private Long postedBy;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;

    public FetchJobResponse(JobWithVoteSummaryProjection p) {
        this.id = p.getJobId();
        this.title = p.getTitle();
        this.description = p.getDescription();
        this.categoryId = p.getCategoryId();
        this.likes = p.getLikes();
        this.dislikes = p.getDislikes();
        this.visitorVoteType = p.getVisitorVoteType();
        this.createdOn = p.getCreatedOn();
        this.company = p.getCompany();
    }
}
