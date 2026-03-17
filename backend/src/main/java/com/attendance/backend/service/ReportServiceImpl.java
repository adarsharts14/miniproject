package com.attendance.backend.service;

import com.attendance.backend.dto.AttendanceDto;
import com.attendance.backend.dto.AttendanceReportDto;
import com.attendance.backend.model.AttendanceStatus;
import com.attendance.backend.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final StudentService studentService;
    private final AttendanceService attendanceService;
    private final AttendanceRepository attendanceRepository;

    @Override
    public AttendanceReportDto getStudentReport(Long studentId) {
        var studentDto = studentService.getStudentById(studentId);
        List<AttendanceDto> history = attendanceService.getAttendanceByStudent(studentId);
        
        long presentCount = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        long absentCount = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.ABSENT);
        long totalCount = presentCount + absentCount;
        
        double percentage = totalCount > 0 ? (double) presentCount / totalCount * 100.0 : 0.0;
        
        return AttendanceReportDto.builder()
                .student(studentDto)
                .totalClasses(totalCount)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .attendancePercentage(percentage)
                .history(history)
                .build();
    }
}
