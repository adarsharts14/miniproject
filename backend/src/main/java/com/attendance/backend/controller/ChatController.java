package com.attendance.backend.controller;

import com.attendance.backend.dto.ChatRequest;
import com.attendance.backend.dto.ChatResponse;
import com.attendance.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/ask")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ChatResponse> askChatbot(@RequestBody ChatRequest request) {
        ChatResponse response = chatService.processTeacherPrompt(request);
        return ResponseEntity.ok(response);
    }
}
