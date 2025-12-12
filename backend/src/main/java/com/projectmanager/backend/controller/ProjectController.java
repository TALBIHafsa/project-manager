package com.projectmanager.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projectmanager.backend.dto.request.ProjectRequest;
import com.projectmanager.backend.dto.response.ProjectResponse;
import com.projectmanager.backend.security.UserDetailsImpl;
import com.projectmanager.backend.service.ProjectService;
import org.springframework.security.core.Authentication;

import lombok.RequiredArgsConstructor;
import java.util.UUID;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody ProjectRequest request,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        return ResponseEntity.ok(projectService.createProject(request, email));
    }

    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getUserProjects(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {

        String email = getUserEmail(authentication);
        return ResponseEntity.ok(projectService.getUserProjects(email, search, page, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable UUID id,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        return ResponseEntity.ok(projectService.getProjectById(id, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable UUID id,
            @RequestBody ProjectRequest request,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        return ResponseEntity.ok(projectService.updateProject(id, request, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable UUID id,
            Authentication authentication) {
        String email = getUserEmail(authentication);
        projectService.deleteProject(id, email);
        return ResponseEntity.noContent().build();
    }

    private String getUserEmail(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getUsername();
    }

}
