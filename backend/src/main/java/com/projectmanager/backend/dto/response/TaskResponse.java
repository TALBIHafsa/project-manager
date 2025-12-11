package com.projectmanager.backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private boolean isCompleted;
    private LocalDate dueDate;
    private UUID projectId;
}