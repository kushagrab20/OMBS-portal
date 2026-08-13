package com.ombs.matching.repository;

import com.ombs.matching.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByMemberId(String memberId);
    List<Job> findByMaidId(String maidId);
    List<Job> findByStatus(String status);
}
