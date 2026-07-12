package com.unitidepharma.backend.repository;

import com.unitidepharma.backend.entity.MRVisit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MRVisitRepository extends JpaRepository<MRVisit, Long> {

    List<MRVisit> findByMrIdOrderByTimestampDesc(Long mrId);
}