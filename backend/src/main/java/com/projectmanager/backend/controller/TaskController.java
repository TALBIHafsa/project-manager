package com.projectmanager.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projectmanager.backend.dto.request.TaskRequest;
import com.projectmanager.backend.dto.response.TaskResponse;
import com.projectmanager.backend.security.UserDetailsImpl;
import com.projectmanager.backend.service.TaskService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable UUID projectId,
            @RequestBody TaskRequest request,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        return ResponseEntity.ok(taskService.createTask(projectId, request, email));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(
            @PathVariable UUID projectId,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        return ResponseEntity.ok(taskService.getTasksByProject(projectId, email));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID taskId,
            @RequestBody TaskRequest request,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        return ResponseEntity.ok(taskService.updateTask(taskId, request, email));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID taskId,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        taskService.deleteTask(taskId, email);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/tasks/{taskId}/complete")
    public ResponseEntity<TaskResponse> markTaskComplete(
            @PathVariable UUID taskId,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        return ResponseEntity.ok(taskService.markTaskAsCompleted(taskId, email));
    }

    @PatchMapping("/tasks/{taskId}/incomplete")
    public ResponseEntity<TaskResponse> markTaskIncomplete(
            @PathVariable UUID taskId,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        return ResponseEntity.ok(taskService.markTaskAsIncomplete(taskId, email));
    }

    private String getUserEmail(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getUsername();
    }

}
