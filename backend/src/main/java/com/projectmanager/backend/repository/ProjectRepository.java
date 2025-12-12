package com.projectmanager.backend.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.UUID;
import com.projectmanager.backend.model.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    // @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.tasks WHERE
    // p.user.email = :email")
    // List<Project> findByUserEmail(@Param("email") String email);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.id = :id")
    Optional<Project> findByIdWithTasks(@Param("id") UUID id);

    @EntityGraph(attributePaths = "tasks")
    Page<Project> findByUserEmailAndTitleContainingIgnoreCase(String email, String title, Pageable pageable);

    @EntityGraph(attributePaths = "tasks")
    Page<Project> findByUserEmail(String email, Pageable pageable);

}
