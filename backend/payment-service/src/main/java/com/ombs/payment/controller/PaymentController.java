package com.ombs.payment.controller;

import com.ombs.payment.model.Payment;
import com.ombs.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/request")
    public ResponseEntity<?> requestPayment(@RequestBody Payment payment) {
        payment.setPaymentDone("No");
        payment.setPaymentDate(null);
        Payment savedPayment = paymentRepository.save(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPayment);
    }

    @PostMapping("/{transactionId}/pay")
    public ResponseEntity<?> processPayment(@PathVariable Long transactionId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(transactionId);
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Transaction not found"));
        }

        Payment payment = paymentOpt.get();
        payment.setPaymentDone("Yes");
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        return ResponseEntity.ok(Map.of("message", "Payment completed successfully", "transaction", payment));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getPaymentByJobId(@PathVariable Long jobId) {
        return paymentRepository.findByJobId(jobId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No payment found for this job")));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Payment>> getPaymentsByMember(@PathVariable String memberId) {
        return ResponseEntity.ok(paymentRepository.findByMemberId(memberId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Payment>> getPaymentHistory() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<?> checkPaymentStatus(@PathVariable Long jobId) {
        Optional<Payment> paymentOpt = paymentRepository.findByJobId(jobId);
        if (paymentOpt.isPresent()) {
            return ResponseEntity.ok(Map.of("jobId", jobId, "paid", "Yes".equalsIgnoreCase(paymentOpt.get().getPaymentDone())));
        }
        return ResponseEntity.ok(Map.of("jobId", jobId, "paid", false));
    }
}
