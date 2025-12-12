package com.projectmanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;
import com.projectmanager.backend.model.Project;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.user.email = :email")
    List<Project> findByUserEmail(@Param("email") String email);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.id = :id")
    java.util.Optional<Project> findByIdWithTasks(@Param("id") UUID id);
}
