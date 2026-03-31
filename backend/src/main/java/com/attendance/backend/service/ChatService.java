package com.attendance.backend.service;

import com.attendance.backend.dto.ChatRequest;
import com.attendance.backend.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    public ChatResponse processTeacherPrompt(ChatRequest request) {
        String prompt = request.getPrompt();
        String reply = callGeminiApi(prompt);
        return ChatResponse.builder().reply(reply).build();
    }

    private String callGeminiApi(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String systemInstructions = "You are an intelligent Teacher Assistant Chatbot for the AttendancePro application. " +
                    "Your role is to help teachers manage their syllabus, schedules, and answer general questions. " +
                    "Keep answers concise, helpful, friendly, and properly formatted.";

            String fullPrompt = systemInstructions + "\n\nTeacher Request: " + prompt;

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", fullPrompt);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", Collections.singletonList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(parts));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + geminiApiKey, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null) {
                        List<Map<String, Object>> partsList = (List<Map<String, Object>>) content.get("parts");
                        if (partsList != null && !partsList.isEmpty()) {
                            return (String) partsList.get(0).get("text");
                        }
                    }
                }
            }
            return "I'm sorry, I couldn't generate a response from the AI at this time.";
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return "I encountered an error connecting to my AI brain. Please check the API configuration.";
        }
    }
}
