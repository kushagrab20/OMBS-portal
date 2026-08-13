package com.ombs.user.controller;

import com.ombs.user.model.Maid;
import com.ombs.user.model.Member;
import com.ombs.user.repository.MaidRepository;
import com.ombs.user.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MaidRepository maidRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String MATCHING_SERVICE_URL = "http://localhost:8083/api/matching/jobs";

    @PostMapping("/profile/create")
    public ResponseEntity<?> createProfile(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String role = (String) payload.get("role");
        String name = (String) payload.get("name");
        String address = (String) payload.get("address");
        String email = (String) payload.get("email");
        String phone = (String) payload.get("phone");

        // Validate 10-digit Phone Number
        if (phone == null || !phone.trim().matches("^[0-9]{10}$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid phone number. Exactly 10 numeric digits are required."));
        }

        // Validate Duplicate Email
        if (email != null && !email.trim().isEmpty()) {
            String cleanEmail = email.trim().toLowerCase();
            if (memberRepository.existsByContactEmail(cleanEmail) || maidRepository.existsByContactEmail(cleanEmail)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Email address already registered. Please use a different email."));
            }
        }

        if ("MEMBER".equalsIgnoreCase(role)) {
            Member member = new Member(userId, name, address, email, phone);
            memberRepository.save(member);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Member profile created successfully"));
        } else if ("MAID".equalsIgnoreCase(role)) {
            Integer age = (Integer) payload.get("age");
            String maidType = (String) payload.get("maidType");
            Integer exp = (Integer) payload.get("experienceYears");
            
            // Set properties for maids
            Maid maid = new Maid();
            maid.setMaidId(userId);
            maid.setMaidName(name != null && !name.trim().isEmpty() ? name : "Maid Candidate (" + userId + ")");
            maid.setMaidAddress(address != null ? address : "");
            maid.setMaidAge(age != null ? age : 25);
            maid.setMaidType(maidType != null ? maidType : "Cleaner");
            maid.setExperienceYears(exp != null ? exp : 1);
            maid.setPreferredJobType("Full Time");
            maid.setSalaryExpectation(10000.0);
            maid.setContactEmail(email != null ? email : "");
            maid.setContactPhone(phone != null ? phone : "");
            maid.setStatus("AVAILABLE");
            
            maidRepository.save(maid);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Maid profile created successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid user role for profile creation"));
    }

    // --- Maid Profile Endpoints ---

    @GetMapping("/maids")
    public ResponseEntity<List<Maid>> getAllMaids() {
        List<Maid> maids = maidRepository.findAll();
        maids.forEach(this::applyMaidDefaults);
        return ResponseEntity.ok(maids);
    }

    @GetMapping("/maids/{id}")
    public ResponseEntity<?> getMaidById(@PathVariable String id) {
        Optional<Maid> maidOpt = maidRepository.findById(id);
        if (maidOpt.isPresent()) {
            Maid maid = maidOpt.get();
            applyMaidDefaults(maid);
            return ResponseEntity.ok(maid);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Maid profile not found"));
    }

    private void applyMaidDefaults(Maid maid) {
        if (maid.getMaidName() == null || maid.getMaidName().trim().isEmpty()) {
            maid.setMaidName("Aarti Sharma");
        }
        if (maid.getContactPhone() == null || maid.getContactPhone().trim().isEmpty()) {
            maid.setContactPhone("98765" + String.format("%05d", Math.abs(maid.getMaidId().hashCode() % 100000)));
        }
        if (maid.getContactEmail() == null || maid.getContactEmail().trim().isEmpty()) {
            maid.setContactEmail("maid." + maid.getMaidId() + "@ombs.com");
        }
        if (maid.getMaidAddress() == null || maid.getMaidAddress().trim().isEmpty()) {
            maid.setMaidAddress("Sector 62, Noida, UP");
        }
        if (maid.getMaidType() == null || maid.getMaidType().trim().isEmpty()) {
            maid.setMaidType("Domestic Helper");
        }
    }

    @PutMapping("/maids/{id}")
    public ResponseEntity<?> updateMaid(@PathVariable String id, @RequestBody Maid updatedMaid) {
        return maidRepository.findById(id).map(maid -> {
            if (updatedMaid.getMaidName() != null) {
                maid.setMaidName(updatedMaid.getMaidName());
            }
            maid.setMaidAddress(updatedMaid.getMaidAddress());
            maid.setMaidAge(updatedMaid.getMaidAge());
            maid.setMaidType(updatedMaid.getMaidType());
            maid.setExperienceYears(updatedMaid.getExperienceYears());
            maid.setPreferredJobType(updatedMaid.getPreferredJobType());
            maid.setSalaryExpectation(updatedMaid.getSalaryExpectation());
            maid.setContactEmail(updatedMaid.getContactEmail());
            maid.setContactPhone(updatedMaid.getContactPhone());
            if (updatedMaid.getStatus() != null) {
                maid.setStatus(updatedMaid.getStatus());
            }
            maidRepository.save(maid);
            return ResponseEntity.ok(maid);
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // --- Member Profile Endpoints ---

    @GetMapping("/members")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberRepository.findAll());
    }

    @GetMapping("/members/{id}")
    public ResponseEntity<?> getMemberById(@PathVariable String id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isPresent()) {
            return ResponseEntity.ok(member.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Member profile not found"));
    }

    @PutMapping("/members/{id}")
    public ResponseEntity<?> updateMember(@PathVariable String id, @RequestBody Member updatedMember) {
        return memberRepository.findById(id).map(member -> {
            member.setMemberName(updatedMember.getMemberName());
            member.setMemberAddress(updatedMember.getMemberAddress());
            member.setContactEmail(updatedMember.getContactEmail());
            member.setContactPhone(updatedMember.getContactPhone());
            memberRepository.save(member);
            return ResponseEntity.ok(member);
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // --- Profile Matching Suggestions API ---

    @GetMapping("/maids/{maidId}/matching-jobs")
    public ResponseEntity<?> getMatchingJobsForMaid(@PathVariable String maidId) {
        Optional<Maid> maidOpt = maidRepository.findById(maidId);
        if (maidOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Maid profile not found"));
        }
        Maid maid = maidOpt.get();
        String skill = maid.getMaidType().toLowerCase();
        String location = maid.getMaidAddress().toLowerCase();

        try {
            // Fetch all jobs from matching-service
            ResponseEntity<List> response = restTemplate.getForEntity(MATCHING_SERVICE_URL, List.class);
            List<Map<String, Object>> jobs = response.getBody();
            if (jobs == null) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            // Filter jobs based on description/type matching skill, and location matching
            List<Map<String, Object>> matchingJobs = jobs.stream()
                    .filter(job -> "PENDING".equalsIgnoreCase((String) job.get("status")))
                    .filter(job -> {
                        String jobDetail = ((String) job.get("jobDetail")).toLowerCase();
                        String jobType = ((String) job.get("jobType")).toLowerCase();
                        String jobLocation = ((String) job.get("jobLocation")).toLowerCase();

                        // Check match on skill (sitter/cleaner/cook) and location (sub-string matching)
                        boolean skillMatch = jobDetail.contains(skill) || skill.contains(jobDetail) || jobType.contains(skill);
                        boolean locationMatch = jobLocation.contains(location) || location.contains(jobLocation);

                        return skillMatch && locationMatch;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(matchingJobs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not fetch jobs from matching service: " + e.getMessage()));
        }
    }

    @GetMapping("/members/{memberId}/matching-maids")
    public ResponseEntity<?> getMatchingMaidsForMember(@PathVariable String memberId) {
        Optional<Member> memberOpt = memberRepository.findById(memberId);
        if (memberOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Member profile not found"));
        }
        Member member = memberOpt.get();
        String address = member.getMemberAddress().toLowerCase();

        // Get available maids and filter by proximity (matching address/city)
        List<Maid> availableMaids = maidRepository.findAll().stream()
                .filter(maid -> "AVAILABLE".equalsIgnoreCase(maid.getStatus()))
                .filter(maid -> {
                    String maidAddress = maid.getMaidAddress().toLowerCase();
                    return maidAddress.contains(address) || address.contains(maidAddress);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(availableMaids);
    }
}
