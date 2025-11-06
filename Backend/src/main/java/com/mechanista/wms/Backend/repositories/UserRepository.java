package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.entities.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByRole(UserRole role);
}
