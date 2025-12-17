package com.samson.jobfinder.models.requests;

import com.samson.jobfinder.models.enums.VoteType;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Setter
@Getter
public class VoteRequest {
    @NonNull
    private VoteType voteType;
}
