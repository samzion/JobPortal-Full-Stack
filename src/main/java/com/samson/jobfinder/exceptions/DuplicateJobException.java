package com.samson.jobfinder.exceptions;

public class DuplicateJobException extends AppException {
    public DuplicateJobException() {
        super("This job has already been posted.");
    }
}