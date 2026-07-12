package com.unitidepharma.backend.repository;

import com.unitidepharma.backend.entity.MRLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MRLocationRepository extends JpaRepository<MRLocation, Long> {

    List<MRLocation> findByMrIdOrderByTimestampDesc(Long mrId);

    // ✅ NEW → latest location
    MRLocation findTopByMrIdOrderByTimestampDesc(Long mrId);
}