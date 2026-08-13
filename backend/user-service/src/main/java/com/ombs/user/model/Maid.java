package com.ombs.user.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "maids")
public class Maid {
    @Id
    private String maidId; // 6-digit User ID
    private String maidName;
    private String maidAddress;
    private Integer maidAge;
    private String maidType; // Baby sitter / Cleaner / Cook
    private Integer experienceYears;
    private String preferredJobType; // Full Time / Part Time
    private Double salaryExpectation;
    private String contactEmail;
    private String contactPhone;
    private String status; // AVAILABLE, ALLOCATED

    public Maid() {}

    public Maid(String maidId, String maidName, String maidAddress, Integer maidAge, String maidType, Integer experienceYears, String preferredJobType, Double salaryExpectation, String contactEmail, String contactPhone, String status) {
        this.maidId = maidId;
        this.maidName = maidName;
        this.maidAddress = maidAddress;
        this.maidAge = maidAge;
        this.maidType = maidType;
        this.experienceYears = experienceYears;
        this.preferredJobType = preferredJobType;
        this.salaryExpectation = salaryExpectation;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.status = status;
    }

    public String getMaidId() {
        return maidId;
    }

    public void setMaidId(String maidId) {
        this.maidId = maidId;
    }

    public String getMaidAddress() {
        return maidAddress;
    }

    public void setMaidAddress(String maidAddress) {
        this.maidAddress = maidAddress;
    }

    public Integer getMaidAge() {
        return maidAge;
    }

    public void setMaidAge(Integer maidAge) {
        this.maidAge = maidAge;
    }

    public String getMaidType() {
        return maidType;
    }

    public void setMaidType(String maidType) {
        this.maidType = maidType;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getPreferredJobType() {
        return preferredJobType;
    }

    public void setPreferredJobType(String preferredJobType) {
        this.preferredJobType = preferredJobType;
    }

    public Double getSalaryExpectation() {
        return salaryExpectation;
    }

    public void setSalaryExpectation(Double salaryExpectation) {
        this.salaryExpectation = salaryExpectation;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMaidName() {
        return maidName;
    }

    public void setMaidName(String maidName) {
        this.maidName = maidName;
    }
}
