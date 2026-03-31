package com.attendance.backend.service;

import com.attendance.backend.dto.StudentDto;
import com.attendance.backend.model.Student;
import com.attendance.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return mapToDto(student);
    }

    @Override
    public StudentDto getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found with email: " + email));
        return mapToDto(student);
    }

    @Override
    public List<StudentDto> getStudentsBySection(String section) {
        return studentRepository.findBySection(section).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto createStudent(StudentDto studentDto) {
        if (studentRepository.existsByRollNumber(studentDto.getRollNumber())) {
            throw new RuntimeException("Roll number already exists");
        }
        if (studentRepository.existsByEmail(studentDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        Student student = Student.builder()
                .name(studentDto.getName())
                .rollNumber(studentDto.getRollNumber())
                .section(studentDto.getSection())
                .email(studentDto.getEmail())
                .build();
                
        return mapToDto(studentRepository.save(student));
    }

    @Override
    public StudentDto updateStudent(Long id, StudentDto studentDto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
                
        student.setName(studentDto.getName());
        student.setRollNumber(studentDto.getRollNumber());
        student.setSection(studentDto.getSection());
        student.setEmail(studentDto.getEmail());
        
        return mapToDto(studentRepository.save(student));
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        studentRepository.delete(student);
    }
    
    private StudentDto mapToDto(Student student) {
        return StudentDto.builder()
                .id(student.getId())
                .name(student.getName())
                .rollNumber(student.getRollNumber())
                .section(student.getSection())
                .email(student.getEmail())
                .build();
    }
}
