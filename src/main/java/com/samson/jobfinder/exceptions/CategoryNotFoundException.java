package com.samson.jobfinder.exceptions;

public class CategoryNotFoundException extends AppException {
    public CategoryNotFoundException(Integer categoryId) {
        super("Category not found: " + categoryId);
    }
}
