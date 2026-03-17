package com.attendance.backend.service;

import com.attendance.backend.dto.AuthRequest;
import com.attendance.backend.dto.AuthResponse;
import com.attendance.backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
}
