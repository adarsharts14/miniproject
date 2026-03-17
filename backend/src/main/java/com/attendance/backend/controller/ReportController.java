package com.attendance.backend.controller;

import com.attendance.backend.dto.AttendanceReportDto;
import com.attendance.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<AttendanceReportDto> getStudentReport(@PathVariable Long studentId) {
        return ResponseEntity.ok(reportService.getStudentReport(studentId));
    }
}
