package com.projectmanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import com.projectmanager.backend.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
