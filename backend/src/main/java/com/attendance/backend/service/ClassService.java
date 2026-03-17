package com.attendance.backend.service;

import com.attendance.backend.dto.ClassDto;
import java.util.List;

public interface ClassService {
    List<ClassDto> getAllClasses();
    ClassDto getClassById(Long id);
    List<ClassDto> getClassesByTeacher(Long teacherId);
    ClassDto createClass(ClassDto classDto, String teacherEmail);
    ClassDto updateClass(Long id, ClassDto classDto);
    void deleteClass(Long id);
}
