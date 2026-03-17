package com.attendance.backend.service;

import com.attendance.backend.dto.AttendanceDto;
import com.attendance.backend.dto.MarkAttendanceRequest;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    void markAttendance(MarkAttendanceRequest request);
    List<AttendanceDto> getAttendanceByClassAndDate(Long classId, LocalDate date);
    List<AttendanceDto> getAttendanceByStudent(Long studentId);
}
