package com.ombs.payment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private Long jobId;
    private String memberId;
    private String memberName;
    private Double amount;
    private String paymentDone; // "Yes" or "No"
    private LocalDateTime paymentDate;

    public Payment() {}

    public Payment(Long transactionId, Long jobId, String memberId, String memberName, Double amount, String paymentDone, LocalDateTime paymentDate) {
        this.transactionId = transactionId;
        this.jobId = jobId;
        this.memberId = memberId;
        this.memberName = memberName;
        this.amount = amount;
        this.paymentDone = paymentDone;
        this.paymentDate = paymentDate;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentDone() {
        return paymentDone;
    }

    public void setPaymentDone(String paymentDone) {
        this.paymentDone = paymentDone;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
}
