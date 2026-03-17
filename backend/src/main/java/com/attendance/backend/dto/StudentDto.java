package com.attendance.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Roll Number is required")
    private String rollNumber;

    @NotBlank(message = "Section is required")
    private String section;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
}
