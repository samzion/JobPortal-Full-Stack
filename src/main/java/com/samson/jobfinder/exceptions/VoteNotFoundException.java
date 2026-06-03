package com.samson.jobfinder.exceptions;

public class VoteNotFoundException extends AppException {
    public VoteNotFoundException() {
        super("Vote record missing");
    }
}