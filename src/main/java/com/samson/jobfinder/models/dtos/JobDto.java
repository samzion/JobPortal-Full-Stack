package com.samson.jobfinder.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobDto {
    private Long id;
    private String title;
    private String company;
    private String shortDescription;
    private String fullDescription;
    private String category;
    private int likes;
    private int dislikes;
}
