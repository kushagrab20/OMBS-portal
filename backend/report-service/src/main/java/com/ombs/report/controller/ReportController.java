package com.ombs.report.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/reports")
public class ReportController {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String MATCHING_SERVICE_URL = "http://localhost:8083/api/matching/jobs";
    private static final String USER_SERVICE_URL = "http://localhost:8082/api/users/maids";
    private static final String FEEDBACK_SERVICE_URL = "http://localhost:8085/api/feedbacks";

    @GetMapping("/summary")
    public ResponseEntity<?> getReportSummary() {
        Map<String, Object> summary = new HashMap<>();

        try {
            // 1. Get pending requests count
            List<?> jobs = restTemplate.getForObject(MATCHING_SERVICE_URL, List.class);
            long pendingRequests = 0;
            long allocationsLastYear = 0;

            if (jobs != null) {
                pendingRequests = jobs.stream()
                        .filter(job -> "PENDING".equalsIgnoreCase((String) ((Map<?, ?>) job).get("status")))
                        .count();

                // Allocations in the last 1 year (365 days)
                LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
                allocationsLastYear = jobs.stream()
                        .filter(job -> {
                            Map<?, ?> jobMap = (Map<?, ?>) job;
                            String status = (String) jobMap.get("status");
                            String createdAtStr = (String) jobMap.get("createdAt");
                            
                            if (!"ALLOCATED".equalsIgnoreCase(status) && !"COMPLETED".equalsIgnoreCase(status)) {
                                return false;
                            }
                            
                            if (createdAtStr != null) {
                                try {
                                    // Parse LocalDateTime (ISO format, e.g. 2026-08-10T15:00:00)
                                    LocalDateTime createdAt = LocalDateTime.parse(createdAtStr.substring(0, 19));
                                    return createdAt.isAfter(oneYearAgo);
                                } catch (Exception ex) {
                                    return true; // Fallback
                                }
                            }
                            return true;
                        }).count();
            }
            summary.put("pendingRequests", pendingRequests);
            summary.put("allocationsLastYear", allocationsLastYear);

            // 2. Get available maids count
            List<?> maids = restTemplate.getForObject(USER_SERVICE_URL, List.class);
            long availableMaids = 0;
            if (maids != null) {
                availableMaids = maids.stream()
                        .filter(maid -> "AVAILABLE".equalsIgnoreCase((String) ((Map<?, ?>) maid).get("status")))
                        .count();
            }
            summary.put("availableMaids", availableMaids);

            // 3. Get average rating from feedback-service
            List<?> feedbacks = restTemplate.getForObject(FEEDBACK_SERVICE_URL, List.class);
            double averageRating = 0.0;
            if (feedbacks != null && !feedbacks.isEmpty()) {
                averageRating = feedbacks.stream()
                        .mapToInt(fb -> (Integer) ((Map<?, ?>) fb).get("rating"))
                        .average()
                        .orElse(0.0);
            }
            summary.put("averageRating", Math.round(averageRating * 10.0) / 10.0); // round to 1 decimal

            return ResponseEntity.ok(summary);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to compile report: " + e.getMessage()));
        }
    }

    @GetMapping("/demand-comparison")
    public ResponseEntity<?> getDemandComparison() {
        try {
            List<?> jobs = restTemplate.getForObject(MATCHING_SERVICE_URL, List.class);
            Map<String, Long> demandByYear = new HashMap<>();
            demandByYear.put("2025", 0L);
            demandByYear.put("2026", 0L);

            if (jobs != null) {
                for (Object job : jobs) {
                    Map<?, ?> jobMap = (Map<?, ?>) job;
                    String createdAtStr = (String) jobMap.get("createdAt");
                    if (createdAtStr != null) {
                        try {
                            String year = createdAtStr.substring(0, 4);
                            if ("2025".equals(year) || "2026".equals(year)) {
                                demandByYear.put(year, demandByYear.get(year) + 1);
                            }
                        } catch (Exception ignored) {}
                    }
                }
            }
            return ResponseEntity.ok(demandByYear);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch demand comparison: " + e.getMessage()));
        }
    }

    @GetMapping("/allocations-history")
    public ResponseEntity<?> getAllocationsHistory() {
        try {
            List<?> jobs = restTemplate.getForObject(MATCHING_SERVICE_URL, List.class);
            Map<String, Long> history = new LinkedHashMap<>();
            // Initialize months in order
            history.put("Jan", 0L);
            history.put("Feb", 0L);
            history.put("Mar", 0L);
            history.put("Apr", 0L);
            history.put("May", 0L);
            history.put("Jun", 0L);
            history.put("Jul", 0L);
            history.put("Aug", 0L);
            history.put("Sep", 0L);
            history.put("Oct", 0L);
            history.put("Nov", 0L);
            history.put("Dec", 0L);

            if (jobs != null) {
                for (Object job : jobs) {
                    Map<?, ?> jobMap = (Map<?, ?>) job;
                    String status = (String) jobMap.get("status");
                    String createdAtStr = (String) jobMap.get("createdAt");
                    
                    if (("ALLOCATED".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status)) && createdAtStr != null) {
                        try {
                            LocalDateTime dt = LocalDateTime.parse(createdAtStr.substring(0, 19));
                            // Group by Month (using abbreviation)
                            String month = dt.format(DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH));
                            if (history.containsKey(month)) {
                                history.put(month, history.get(month) + 1);
                            }
                        } catch (Exception ignored) {}
                    }
                }
            }
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch allocations history: " + e.getMessage()));
        }
    }
}
