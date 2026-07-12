package com.unitidepharma.backend.repository;

import com.unitidepharma.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}