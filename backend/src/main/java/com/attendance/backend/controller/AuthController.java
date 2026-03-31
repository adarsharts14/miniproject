package com.attendance.backend.controller;

import com.attendance.backend.dto.AuthRequest;
import com.attendance.backend.dto.AuthResponse;
import com.attendance.backend.dto.RegisterRequest;
import com.attendance.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerStudent(request));
    }
}
