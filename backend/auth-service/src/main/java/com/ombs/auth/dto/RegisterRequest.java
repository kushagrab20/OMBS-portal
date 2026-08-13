package com.ombs.auth.dto;

public class RegisterRequest {
    private String userId;
    private String password;
    private String role; // ADMIN, MEMBER, MAID
    
    // Member / Maid profile details
    private String name;
    private String address;
    private Integer age; // Maid age
    private String maidType; // Baby sitter / Cleaner / Cook
    private Integer experienceYears; // Maid experience
    private String email;
    private String phone;

    public RegisterRequest() {}

    public RegisterRequest(String userId, String password, String role, String name, String address, Integer age, String maidType, String email, String phone) {
        this.userId = userId;
        this.password = password;
        this.role = role;
        this.name = name;
        this.address = address;
        this.age = age;
        this.maidType = maidType;
        this.email = email;
        this.phone = phone;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getMaidType() {
        return maidType;
    }

    public void setMaidType(String maidType) {
        this.maidType = maidType;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }
}
