package com.attendance.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClassDto {
    private Long id;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @NotBlank(message = "Section is required")
    private String section;

    @NotBlank(message = "Schedule time is required")
    private String scheduleTime;

    private Long teacherId;
    private String teacherName;
}
