package com.attendance.backend.service;

import com.attendance.backend.dto.AttendanceDto;
import com.attendance.backend.dto.MarkAttendanceRequest;
import com.attendance.backend.model.Attendance;
import com.attendance.backend.model.ClassEntity;
import com.attendance.backend.model.Student;
import com.attendance.backend.repository.AttendanceRepository;
import com.attendance.backend.repository.ClassRepository;
import com.attendance.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public void markAttendance(MarkAttendanceRequest request) {
        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        List<Attendance> attendancesToSave = new ArrayList<>();

        for (MarkAttendanceRequest.StudentAttendance sa : request.getAttendances()) {
            Student student = studentRepository.findById(sa.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found ID: " + sa.getStudentId()));

            Optional<Attendance> existing = attendanceRepository.findByStudentIdAndClassEntityIdAndDate(
                    student.getId(), classEntity.getId(), request.getDate());

            if (existing.isPresent()) {
                Attendance attendance = existing.get();
                attendance.setStatus(sa.getStatus());
                attendancesToSave.add(attendance);
            } else {
                Attendance newAttendance = Attendance.builder()
                        .student(student)
                        .classEntity(classEntity)
                        .date(request.getDate())
                        .status(sa.getStatus())
                        .build();
                attendancesToSave.add(newAttendance);
            }
        }

        attendanceRepository.saveAll(attendancesToSave);
    }

    @Override
    public List<AttendanceDto> getAttendanceByClassAndDate(Long classId, LocalDate date) {
        return attendanceRepository.findByClassEntityIdAndDate(classId, date).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDto> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AttendanceDto mapToDto(Attendance attendance) {
        return AttendanceDto.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentName(attendance.getStudent().getName())
                .rollNumber(attendance.getStudent().getRollNumber())
                .classId(attendance.getClassEntity().getId())
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .build();
    }
}
