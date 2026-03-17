package com.attendance.backend.repository;

import com.attendance.backend.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByClassEntityIdAndDate(Long classId, LocalDate date);
    List<Attendance> findByStudentId(Long studentId);
    Optional<Attendance> findByStudentIdAndClassEntityIdAndDate(Long studentId, Long classId, LocalDate date);
    long countByStudentIdAndStatus(Long studentId, com.attendance.backend.model.AttendanceStatus status);
}
