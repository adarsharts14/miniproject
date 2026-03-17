package com.attendance.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceReportDto {
    private StudentDto student;
    private long totalClasses;
    private long presentCount;
    private long absentCount;
    private double attendancePercentage;
    private List<AttendanceDto> history;
}
