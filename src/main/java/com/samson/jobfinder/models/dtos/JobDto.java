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
    private String description;
    private String company;
    private Integer categoryId;


}
