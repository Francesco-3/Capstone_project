package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Role;
import com.mechanista.wms.Backend.entities.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByUserRole(UserRole userRole);
}
