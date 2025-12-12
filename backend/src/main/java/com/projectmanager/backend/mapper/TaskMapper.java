package com.projectmanager.backend.mapper;

import com.projectmanager.backend.dto.request.TaskRequest;
import com.projectmanager.backend.dto.response.TaskResponse;
import com.projectmanager.backend.model.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public Task toEntity(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setCompleted(request.getIsCompleted() != null && request.getIsCompleted());
        return task;
    }

    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .isCompleted(task.isCompleted())
                .projectId(task.getProject() != null ? task.getProject().getId() : null) // Safe check
                .build();
    }
}