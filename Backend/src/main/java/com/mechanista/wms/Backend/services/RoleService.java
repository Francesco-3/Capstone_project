package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Role;
import com.mechanista.wms.Backend.entities.enums.UserRole;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.repositories.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    // CREATE
    public Role saveRole(Role role) {
        if (roleRepository.findByUserRole(role.getUserRole()).isPresent()) {
            throw new BadRequestException("Il ruolo " + role.getUserRole() + " esiste già!");
        }

        Role savedRole = roleRepository.save(role);
        log.info("Ruolo '{}' creato con successo con l'id: {}", savedRole.getUserRole(), savedRole.getId_role());
        return savedRole;
    }

    // READ
    public Page<Role> findAll(Pageable pageable) {
        return roleRepository.findAll(pageable);
    }

    public Role findById(UUID roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new NotFoundException("Ruolo con l'id " + roleId + " non trovato!"));
    }

    public Role findByName(String name) {
        UserRole role;
        role = UserRole.valueOf(name.toUpperCase());
        return roleRepository.findByUserRole(role)
                .orElseThrow(() -> new NotFoundException("Ruolo " + name + " non trovato!"));
    }

    // UPDATE
    public Role updateRole(UUID roleId, Role updatedRole) {
        Role exixtedRole = this.findById(roleId);

        if(!exixtedRole.getUserRole().equals(updatedRole.getUserRole()) &&
                roleRepository.findByUserRole(updatedRole.getUserRole()).isPresent()) {
            throw new BadRequestException("Il ruolo " + updatedRole.getUserRole() + " esiste già!");
        }

        exixtedRole.setUserRole(updatedRole.getUserRole());
        Role modifiedRole = roleRepository.save(exixtedRole);
        log.info("Ruolo con ID {} aggiornato a '{}'", roleId, modifiedRole.getUserRole());
        return modifiedRole;
    }

    // DELETE
    public void delete(UUID roleId) {
        Role role = this.findById(roleId);

        if (!role.getUsers().isEmpty()) {
            throw new BadRequestException("Impossibile eliminare il ruolo '" + role.getUserRole() +
                    "' perché è assegnato a " + role.getUsers().size() + " utenti");
        }

        roleRepository.delete(role);
        log.info("Ruolo '{}' con ID {} eliminato con successo", role.getUserRole(), roleId);
    }
}
