package com.samson.jobfinder.models.responses;

import com.samson.jobfinder.models.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String companyName;
    private UserRole role;
    private Boolean isCompanyMode;
}