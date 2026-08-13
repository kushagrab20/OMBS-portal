package com.ombs.feedback.repository;

import com.ombs.feedback.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByReceiverId(String receiverId);
    List<Feedback> findBySenderId(String senderId);
}
