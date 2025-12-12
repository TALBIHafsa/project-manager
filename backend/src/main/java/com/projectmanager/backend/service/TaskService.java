package com.projectmanager.backend.service;

import com.projectmanager.backend.dto.request.TaskRequest;
import com.projectmanager.backend.dto.response.TaskResponse;
import com.projectmanager.backend.exception.ResourceNotFoundException;
import com.projectmanager.backend.mapper.TaskMapper;
import com.projectmanager.backend.model.Project;
import com.projectmanager.backend.model.Task;
import com.projectmanager.backend.repository.ProjectRepository;
import com.projectmanager.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;

    @Transactional
    public TaskResponse createTask(UUID projectId, TaskRequest request, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        validateProjectOwnership(project, userEmail);
        if (request.getDueDate() != null && request.getDueDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Due date cannot be in the past");
        }
        Task task = taskMapper.toEntity(request);
        task.setProject(project);

        Task savedTask = taskRepository.save(task);
        log.info("Task created. ID: {}, Project ID: {}, User: {}", savedTask.getId(), projectId, userEmail);
        return taskMapper.toResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(UUID projectId, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        validateProjectOwnership(project, userEmail);

        return taskRepository.findByProjectId(projectId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse updateTask(UUID taskId, TaskRequest request, String userEmail) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        validateTaskOwnership(existingTask, userEmail);

        existingTask.setTitle(request.getTitle());
        existingTask.setDescription(request.getDescription());
        existingTask.setDueDate(request.getDueDate());

        if (request.getIsCompleted() != null) {
            existingTask.setCompleted(request.getIsCompleted());
        }

        Task updatedTask = taskRepository.save(existingTask);
        log.info("Task updated. ID: {}, User: {}", taskId, userEmail);
        return taskMapper.toResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(UUID taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        validateTaskOwnership(task, userEmail);

        taskRepository.deleteById(taskId);
        log.info("Task deleted. ID: {}, User: {}", taskId, userEmail);
    }

    @Transactional
    public TaskResponse markTaskAsCompleted(UUID taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        validateTaskOwnership(task, userEmail);

        task.setCompleted(true);

        Task updatedTask = taskRepository.save(task);

        log.info("Task marked as completed. ID: {}, User: {}", taskId, userEmail);

        return taskMapper.toResponse(updatedTask);
    }

    private void validateTaskOwnership(Task task, String userEmail) {
        if (!task.getProject().getUser().getEmail().equals(userEmail)) {
            throw new ResourceNotFoundException("Task not found");
        }
    }

    private void validateProjectOwnership(Project project, String userEmail) {
        if (!project.getUser().getEmail().equals(userEmail)) {
            throw new ResourceNotFoundException("Project not found");
        }
    }

}