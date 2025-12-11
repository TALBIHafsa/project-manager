package com.projectmanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

import com.projectmanager.backend.model.Project;
import com.projectmanager.backend.model.Task;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Project> findByUserId(UUID userId);
}
