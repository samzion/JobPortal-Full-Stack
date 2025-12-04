package com.samson.jobfinder.models.requests;

import lombok.*;


@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AddNewJobRequest {
    @NonNull
    private String title;
    @NonNull
    private String description;
    @NonNull
    private Integer categoryId;

}
