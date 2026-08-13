package com.ombs.auth.controller;

import com.ombs.auth.dto.AuthRequest;
import com.ombs.auth.dto.RegisterRequest;
import com.ombs.auth.model.User;
import com.ombs.auth.repository.UserRepository;
import com.ombs.auth.util.JwtUtil;
import com.ombs.auth.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RestTemplate restTemplate;

    private static final String USER_SERVICE_URL = "http://localhost:8082/api/users/profile/create";

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // SRS Validation rules
            ValidationUtils.validateUserId(request.getUserId());
            ValidationUtils.validatePassword(request.getPassword());

            if (userRepository.existsById(request.getUserId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "User ID already exists"));
            }

            // Create login credentials
            User user = new User();
            user.setUserId(request.getUserId());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            userRepository.save(user);

            // Forward profile creation to user-service
            Map<String, Object> profilePayload = new HashMap<>();
            profilePayload.put("userId", request.getUserId());
            profilePayload.put("role", request.getRole());
            profilePayload.put("name", request.getName());
            profilePayload.put("address", request.getAddress());
            profilePayload.put("age", request.getAge());
            profilePayload.put("maidType", request.getMaidType());
            profilePayload.put("experienceYears", request.getExperienceYears());
            profilePayload.put("email", request.getEmail());
            profilePayload.put("phone", request.getPhone());

            try {
                restTemplate.postForEntity(USER_SERVICE_URL, profilePayload, String.class);
            } catch (HttpStatusCodeException e) {
                // Rollback user credentials if profile creation fails in user-service
                userRepository.deleteById(request.getUserId());
                return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
            } catch (Exception e) {
                userRepository.deleteById(request.getUserId());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to create user profile: " + e.getMessage()));
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            // SRS Validation rules
            ValidationUtils.validateUserId(request.getUserId());
            ValidationUtils.validatePassword(request.getPassword());

            Optional<User> userOpt = userRepository.findById(request.getUserId());
            if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User ID and Password does not match"));
            }

            User user = userOpt.get();
            String token = jwtUtil.generateToken(user.getUserId(), user.getRole());

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("userId", user.getUserId());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token, @RequestParam String userId) {
        boolean isValid = jwtUtil.validateToken(token, userId);
        if (isValid) {
            String role = jwtUtil.extractRole(token);
            return ResponseEntity.ok(Map.of("valid", true, "role", role));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
    }
}
