package com.ombs.matching.controller;

import com.ombs.matching.model.Job;
import com.ombs.matching.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/matching")
public class AllocationController {

    @Autowired
    private JobRepository jobRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    
    private static final String USER_SERVICE_URL = "http://localhost:8082/api/users";
    private static final String PAYMENT_SERVICE_URL = "http://localhost:8084/api/payments/request";

    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(@RequestBody Job job) {
        job.setStatus("PENDING");
        job.setCreatedAt(LocalDateTime.now());
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobRepository.findById(id);
        if (job.isPresent()) {
            return ResponseEntity.ok(job.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Job request not found"));
    }

    @GetMapping("/members/{memberId}/jobs")
    public ResponseEntity<List<Job>> getJobsByMember(@PathVariable String memberId) {
        return ResponseEntity.ok(jobRepository.findByMemberId(memberId));
    }

    @GetMapping("/maids/{maidId}/jobs")
    public ResponseEntity<List<Job>> getJobsByMaid(@PathVariable String maidId) {
        return ResponseEntity.ok(jobRepository.findByMaidId(maidId));
    }

    @PostMapping("/jobs/{jobId}/allocate")
    public ResponseEntity<?> allocateMaid(@PathVariable Long jobId, @RequestParam String maidId) {
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Job request not found"));
        }

        Job job = jobOpt.get();
        if (!"PENDING".equalsIgnoreCase(job.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Job request is already allocated or completed"));
        }

        // 1. Fetch Member details from user-service
        String memberName = "Member";
        try {
            Map<?, ?> member = restTemplate.getForObject(USER_SERVICE_URL + "/members/" + job.getMemberId(), Map.class);
            if (member != null && member.containsKey("memberName")) {
                memberName = (String) member.get("memberName");
            }
        } catch (Exception e) {
            // Log and fall back to default name
            System.err.println("Failed to fetch member details: " + e.getMessage());
        }

        // 2. Fetch Maid details from user-service to ensure maid exists and is available
        try {
            Map<?, ?> maid = restTemplate.getForObject(USER_SERVICE_URL + "/maids/" + maidId, Map.class);
            if (maid == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Maid profile not found"));
            }
            String maidStatus = (String) maid.get("status");
            if (!"AVAILABLE".equalsIgnoreCase(maidStatus)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Maid is not available for allocation"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to check maid status from User Service: " + e.getMessage()));
        }

        // 3. Allocate Maid in Job entity
        job.setMaidId(maidId);
        job.setStatus("ALLOCATED");
        jobRepository.save(job);

        // 4. Update Maid status to ALLOCATED in user-service
        try {
            Map<String, Object> updatePayload = new HashMap<>();
            updatePayload.put("maidAddress", ""); // placeholder (controller handles partial updates)
            updatePayload.put("status", "ALLOCATED");
            restTemplate.put(USER_SERVICE_URL + "/maids/" + maidId, updatePayload);
        } catch (Exception e) {
            // Rollback job status on failure
            job.setMaidId(null);
            job.setStatus("PENDING");
            jobRepository.save(job);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update maid status: " + e.getMessage()));
        }

        // 5. Trigger payment prompt in payment-service
        try {
            Map<String, Object> paymentPayload = new HashMap<>();
            paymentPayload.put("jobId", jobId);
            paymentPayload.put("memberId", job.getMemberId());
            paymentPayload.put("memberName", memberName);
            paymentPayload.put("amount", 500.0); // Flat matching/allocation service fee
            restTemplate.postForEntity(PAYMENT_SERVICE_URL, paymentPayload, String.class);
        } catch (Exception e) {
            System.err.println("Failed to prompt payment service: " + e.getMessage());
            // We do not roll back the allocation here as it is considered done, 
            // but the payment request should be retryable or recorded.
        }

        return ResponseEntity.ok(Map.of("message", "Maid allocated successfully. Payment request created."));
    }
}
