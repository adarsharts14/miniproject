package com.attendance.backend.service;

import com.attendance.backend.dto.ClassDto;
import com.attendance.backend.model.ClassEntity;
import com.attendance.backend.model.User;
import com.attendance.backend.repository.ClassRepository;
import com.attendance.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    @Override
    public List<ClassDto> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClassDto getClassById(Long id) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        return mapToDto(classEntity);
    }

    @Override
    public List<ClassDto> getClassesByTeacher(Long teacherId) {
        return classRepository.findByTeacherId(teacherId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClassDto createClass(ClassDto classDto, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        ClassEntity classEntity = ClassEntity.builder()
                .subjectName(classDto.getSubjectName())
                .section(classDto.getSection())
                .scheduleTime(classDto.getScheduleTime())
                .teacher(teacher)
                .build();

        return mapToDto(classRepository.save(classEntity));
    }

    @Override
    public ClassDto updateClass(Long id, ClassDto classDto) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        classEntity.setSubjectName(classDto.getSubjectName());
        classEntity.setSection(classDto.getSection());
        classEntity.setScheduleTime(classDto.getScheduleTime());

        return mapToDto(classRepository.save(classEntity));
    }

    @Override
    public void deleteClass(Long id) {
        ClassEntity classEntity = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
        classRepository.delete(classEntity);
    }

    private ClassDto mapToDto(ClassEntity classEntity) {
        return ClassDto.builder()
                .id(classEntity.getId())
                .subjectName(classEntity.getSubjectName())
                .section(classEntity.getSection())
                .scheduleTime(classEntity.getScheduleTime())
                .teacherId(classEntity.getTeacher().getId())
                .teacherName(classEntity.getTeacher().getName())
                .build();
    }
}
