package com.ombs.user.repository;

import com.ombs.user.model.Maid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaidRepository extends JpaRepository<Maid, String> {
    List<String> findByStatus(String status);
    List<Maid> findByMaidTypeAndMaidAddressContainingIgnoreCase(String maidType, String address);
    boolean existsByContactEmail(String contactEmail);
}
