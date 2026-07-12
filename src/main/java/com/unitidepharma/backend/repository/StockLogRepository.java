package com.unitidepharma.backend.repository;

import com.unitidepharma.backend.entity.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockLogRepository extends JpaRepository<StockLog, Long> {
}
