package com.samson.jobfinder.exceptions;

public class InvalidSortException extends AppException {
    public InvalidSortException(String value) {
        super("Invalid sortBy value: " + value);
    }
}