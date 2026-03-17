package com.attendance.backend.service;

import com.attendance.backend.dto.AttendanceReportDto;

public interface ReportService {
    AttendanceReportDto getStudentReport(Long studentId);
}
