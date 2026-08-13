package com.ombs.auth;

import com.ombs.auth.util.ValidationUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ValidationTests {

    // --- User ID Test Cases ---

    @Test
    public void testUserIdLessThan6Digits() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validateUserId("12345");
        });
        assertEquals("Please enter a 6 digit no", exception.getMessage());
    }

    @Test
    public void testUserIdEquals6Digits() {
        assertDoesNotThrow(() -> {
            ValidationUtils.validateUserId("123456");
        });
    }

    @Test
    public void testUserIdMoreThan6Digits() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validateUserId("1234567");
        });
        assertEquals("Please enter a 6 digit no", exception.getMessage());
    }

    @Test
    public void testUserIdIsCharData() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validateUserId("abcdef");
        });
        assertEquals("Please enter a 6 digit no", exception.getMessage());
    }

    @Test
    public void testUserIdIsAlphanumeric() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validateUserId("123a56");
        });
        assertEquals("Please enter a 6 digit no", exception.getMessage());
    }

    @Test
    public void testUserIdIsBlank() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validateUserId("");
        });
        assertEquals("User ID cannot be blank", exception.getMessage());
    }

    // --- Password Test Cases ---

    @Test
    public void testPasswordLessThan6Char() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validatePassword("pass1");
        });
        assertEquals("Password must be between 6 and 10 characters", exception.getMessage());
    }

    @Test
    public void testPasswordMoreThan10Char() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validatePassword("password123");
        });
        assertEquals("Password must be between 6 and 10 characters", exception.getMessage());
    }

    @Test
    public void testPasswordBetween6And10Char() {
        assertDoesNotThrow(() -> {
            ValidationUtils.validatePassword("pass123");
        });
    }

    @Test
    public void testPasswordIsNumericData() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validatePassword("1234567");
        });
        assertEquals("Password cannot be purely numeric", exception.getMessage());
    }

    @Test
    public void testPasswordIsBlank() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ValidationUtils.validatePassword("");
        });
        assertEquals("Password cannot be blank", exception.getMessage());
    }
}
