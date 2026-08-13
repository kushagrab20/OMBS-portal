package com.ombs.feedback.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;

@Component
public class FeedbackRequestScheduler {

    private final Random random = new Random();

    // Trigger every 45 seconds to simulate feedback request prompts
    @Scheduled(fixedRate = 45000)
    public void sendAutomatedFeedbackRequests() {
        // Generating random mock User IDs for the demonstration log
        int memberSuffix = 100000 + random.nextInt(900000);
        int maidSuffix = 100000 + random.nextInt(900000);
        
        String memberId = String.valueOf(memberSuffix);
        String maidId = String.valueOf(maidSuffix);

        System.out.println("[Scheduler - " + LocalDateTime.now() + "] "
                + "Automated feedback request sent to Member: " + memberId 
                + " regarding Maid: " + maidId + " (Simulating 7-day post-allocation follow-up email)");
    }
}
