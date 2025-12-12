package com.projectmanager.backend.dto.request;

import java.time.LocalDate;
import lombok.Data;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;

@Data
public class TaskRequest {
    @NotBlank(message = "Task title is required")
    private String title;
    @NotBlank(message = "Task description is required")
    private String description;

    @FutureOrPresent(message = "Due date cannot be in the past")
    private LocalDate dueDate;

    // Only used during updates
    private Boolean isCompleted;
}
