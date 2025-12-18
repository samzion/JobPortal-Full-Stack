package com.samson.jobfinder.models.dtos;

import com.samson.jobfinder.models.entities.Job;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobDto {

    private Long id;
    private String title;
    private String description;
    private String company;
    private Integer categoryId;
    private String visitorVoteStatus;
    private int likes;
    private int dislikes;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;


    public JobDto(Job job, String visitorVoteStatus) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.description = job.getDescription();
        this.company =  job.getCompany();
        this.categoryId =  job.getCategory().getId();
        this.visitorVoteStatus = visitorVoteStatus;
        this.likes = job.getLikes();
        this.dislikes = job.getDislikes();
        this.createdOn=job.getCreatedOn();
    }


    public JobDto(Job job) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.description = job.getDescription();
        this.company =  job.getCompany();
        this.categoryId =  job.getCategory().getId();
        this.createdOn=job.getCreatedOn();
    }
}
