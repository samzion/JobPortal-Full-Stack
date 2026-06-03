package com.samson.jobfinder.exceptions;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ApiErrorResponse {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    private int status;
    private String error;
    private String message;

    public static ApiErrorResponse of(String message, int status) {
        return new ApiErrorResponse(
                LocalDateTime.now(),
                status,
                HttpStatus.valueOf(status).name(),
                message
        );
    }
}