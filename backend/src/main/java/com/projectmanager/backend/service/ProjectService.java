package com.projectmanager.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projectmanager.backend.repository.UserRepository;

import com.projectmanager.backend.dto.request.ProjectRequest;
import com.projectmanager.backend.dto.response.ProjectResponse;
import com.projectmanager.backend.exception.ResourceNotFoundException;
import com.projectmanager.backend.mapper.ProjectMapper;
import com.projectmanager.backend.model.Project;
import com.projectmanager.backend.repository.ProjectRepository;
import com.projectmanager.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectMapper.toEntity(request);
        project.setUser(user);

        Project savedProject = projectRepository.save(project);
        log.info("Project created. ID: {}, User: {}", savedProject.getId(), userEmail);
        return projectMapper.toResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(String userEmail) {
        return projectRepository.findByUserEmail(userEmail).stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(UUID projectId, String userEmail) {
        Project project = projectRepository.findByIdWithTasks(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        validateProjectOwnership(project, userEmail);

        return projectMapper.toResponse(project);
    }

    @Transactional
    public void deleteProject(UUID projectId, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        validateProjectOwnership(project, userEmail);

        projectRepository.delete(project);
        log.info("Project deleted. ID: {}, User: {}", projectId, userEmail);
    }

    @Transactional
    public ProjectResponse updateProject(UUID projectId, ProjectRequest request, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        validateProjectOwnership(project, userEmail);

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        log.info("Project updated. ID: {}, User: {}", projectId, userEmail);
        return projectMapper.toResponse(updatedProject);
    }

    private void validateProjectOwnership(Project project, String userEmail) {
        if (!project.getUser().getEmail().equals(userEmail)) {
            throw new ResourceNotFoundException("Project not found");
        }
    }

}
