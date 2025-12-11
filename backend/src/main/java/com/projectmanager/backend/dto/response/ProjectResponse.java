package com.projectmanager.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProjectResponse {
    private UUID id;
    private String title;
    private String description;
    private LocalDateTime createdAt;

    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;
}