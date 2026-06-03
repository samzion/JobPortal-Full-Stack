package com.samson.jobfinder.models.responses;

import com.samson.jobfinder.models.entities.Job;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddNewJobResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private Integer categoryId;
    private String visitorVoteStatus;
    private int likes;
    private int dislikes;
    private LocalDateTime createdOn;

    public AddNewJobResponse(Job job) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.description = job.getDescription();
        this.company =  job.getCompany();
        this.categoryId =  job.getCategory().getId();
        this.createdOn=job.getCreatedOn();
    }
}
