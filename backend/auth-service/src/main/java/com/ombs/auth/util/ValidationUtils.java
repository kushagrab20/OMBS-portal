package com.ombs.auth.util;

public class ValidationUtils {

    public static void validateUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be blank");
        }
        // Match exactly 6 digits
        if (!userId.matches("^\\d{6}$")) {
            throw new IllegalArgumentException("Please enter a 6 digit no");
        }
    }

    public static void validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be blank");
        }
        if (password.length() < 6 || password.length() > 10) {
            throw new IllegalArgumentException("Password must be between 6 and 10 characters");
        }
        // Check if purely numeric
        if (password.matches("^\\d+$")) {
            throw new IllegalArgumentException("Password cannot be purely numeric");
        }
    }
}
