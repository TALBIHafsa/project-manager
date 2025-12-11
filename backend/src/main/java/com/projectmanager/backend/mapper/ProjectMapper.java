package com.projectmanager.backend.mapper;

import org.springframework.stereotype.Component;
import com.projectmanager.backend.dto.request.ProjectRequest;
import com.projectmanager.backend.dto.response.ProjectResponse;
import com.projectmanager.backend.model.Project;
import com.projectmanager.backend.model.Task;
import java.util.List;

@Component
public class ProjectMapper {
    public Project toEntity(ProjectRequest request) {
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        return project;
    }

    public ProjectResponse toResponse(Project project) {
        // Calculate progress here to keep the Service clean
        List<Task> tasks = project.getTasks();
        int total = (tasks == null) ? 0 : tasks.size();
        int completed = (tasks == null) ? 0 : (int) tasks.stream().filter(Task::isCompleted).count();
        double progress = total == 0 ? 0 : ((double) completed / total) * 100;

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .createdAt(project.getCreatedAt())
                .totalTasks(total)
                .completedTasks(completed)
                .progressPercentage(progress)
                .build();
    }
}
