package com.ombs.matching.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    private String jobDetail; // e.g. "Need cleaner for 3 BHK"
    private String jobType; // Full Time / Part Time
    private String jobLocation;
    private Double salary;
    private String memberId; // Employer ID
    private String maidId; // Allocated Employee ID (null initially)
    private String status; // PENDING, ALLOCATED, COMPLETED
    private LocalDateTime createdAt;

    public Job() {}

    public Job(Long jobId, String jobDetail, String jobType, String jobLocation, Double salary, String memberId, String maidId, String status, LocalDateTime createdAt) {
        this.jobId = jobId;
        this.jobDetail = jobDetail;
        this.jobType = jobType;
        this.jobLocation = jobLocation;
        this.salary = salary;
        this.memberId = memberId;
        this.maidId = maidId;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobDetail() {
        return jobDetail;
    }

    public void setJobDetail(String jobDetail) {
        this.jobDetail = jobDetail;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getMaidId() {
        return maidId;
    }

    public void setMaidId(String maidId) {
        this.maidId = maidId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
