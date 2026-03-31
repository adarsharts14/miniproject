package com.attendance.backend.service;

import com.attendance.backend.dto.AuthRequest;
import com.attendance.backend.dto.AuthResponse;
import com.attendance.backend.dto.RegisterRequest;
import com.attendance.backend.model.Role;
import com.attendance.backend.model.User;
import com.attendance.backend.repository.UserRepository;
import com.attendance.backend.repository.StudentRepository;
import com.attendance.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.TEACHER)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateTokenFromUsername(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }
    @Override
    public AuthResponse registerStudent(RegisterRequest request) {
        if (!studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email not found in Student records");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateTokenFromUsername(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }
}
