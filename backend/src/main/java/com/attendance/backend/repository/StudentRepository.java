package com.attendance.backend.repository;

import com.attendance.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findBySection(String section);
    boolean existsByRollNumber(String rollNumber);
    boolean existsByEmail(String email);
    java.util.Optional<Student> findByEmail(String email);
}
