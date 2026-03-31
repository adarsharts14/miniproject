package com.attendance.backend.controller;

import com.attendance.backend.dto.ClassDto;
import com.attendance.backend.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @GetMapping
    public ResponseEntity<List<ClassDto>> getAllClasses() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassDto> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    @GetMapping("/section/{section}")
    public ResponseEntity<List<ClassDto>> getClassesBySection(@PathVariable String section) {
        return ResponseEntity.ok(classService.getClassesBySection(section));
    }

    @PostMapping
    public ResponseEntity<ClassDto> createClass(@Valid @RequestBody ClassDto classDto, Authentication authentication) {
        return new ResponseEntity<>(classService.createClass(classDto, authentication.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassDto> updateClass(@PathVariable Long id, @Valid @RequestBody ClassDto classDto) {
        return ResponseEntity.ok(classService.updateClass(id, classDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}
