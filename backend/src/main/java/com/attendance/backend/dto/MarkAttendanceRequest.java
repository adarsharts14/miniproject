package com.attendance.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MarkAttendanceRequest {
    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotEmpty(message = "Attendance list cannot be empty")
    @Valid
    private List<StudentAttendance> attendances;

    @Data
    public static class StudentAttendance {
        @NotNull(message = "Student ID is required")
        private Long studentId;

        @NotNull(message = "Status is required")
        private com.attendance.backend.model.AttendanceStatus status;
    }
}
