package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Role;
import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.entities.enums.UserRole;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.UserDTO;
import com.mechanista.wms.Backend.repositories.RoleRepository;
import com.mechanista.wms.Backend.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private PasswordEncoder bcrypt;

    @Autowired
    private RoleRepository roleRepository;

    // CREATE
    public User saveUser(UserDTO payload) {
        // controllo se esiste già un utente con questo username
        this.userRepository.findByUsername(payload.username()).ifPresent(user -> {
            throw new BadRequestException("L'username " + user.getUsername() + " è già in uso!");
        });

        // controllo se esiste già un utente con questa email
        this.userRepository.findByEmail(payload.email()).ifPresent(user -> {
            throw new BadRequestException("L'email " + user.getEmail() + " è già registrata!");
        });

        // creo il nuovo utente con i dati inseriti
        User newUser = new User(payload.username(), payload.email(), bcrypt.encode(payload.password()), payload.creation_date());

        // cerco i ruoli disponibili
        List<Role> assignedRole = List.of();
        if (payload.role() != null && !payload.role().isEmpty()) {
            assignedRole = payload.role().stream()
                    .map(role -> roleRepository.findByUserRole(role)
                            .orElseThrow(() -> new RuntimeException("Ruolo " + role + " non trovato nel database!")))
                    .toList();
        }

        // se non ne ha, assegno un ruolo all'utente creato
        if (assignedRole.isEmpty()) {
            Role userRole = roleRepository.findByUserRole(UserRole.MECHANICAL)
                    .orElseGet(() -> roleRepository.save(new Role(UserRole.MECHANICAL)));
            assignedRole = List.of(userRole);
        }

        // salvo il ruolo assegnato e l'utente
        newUser.setRoles(assignedRole);
        User savedUUser = this.userRepository.save(newUser);

        log.info("L'utente " + savedUUser.getUsername() + " è stato salvato correttamente con il ruolo: " + assignedRole);
        return savedUUser;
    }

    // READ
    public User findById(UUID userId) {
        return userRepository.findByIdWithRoles(userId).orElseThrow(() -> new NotFoundException(userId));
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email).orElseThrow(() ->
                new NotFoundException("L'utente con l'email " + email + " non è stato trovato"));
    }

    // UPDATE
    public User findByIdAndUpdate(UUID userId, UserDTO payload) {
        User found = this.findById(userId);

        if (!found.getEmail().equals(payload.email())) {
            this.userRepository.findByEmail(payload.email())
                    .ifPresent(user -> {
                        throw new BadRequestException("L'email " + user.getEmail() + "è già in uso!");
                    });
        }

        found.setUsername(payload.username());
        found.setEmail(payload.email());

        if (payload.password() != null && !payload.password().isEmpty()) {
            found.setPassword(bcrypt.encode(payload.password()));
        }

        User modifiedUser = this.userRepository.save(found);
        log.info("L'utente " + modifiedUser.getUsername() + " è stato aggiornato!");
        return modifiedUser;
    }

    // DELETE
    public void findIdAndDelete(UUID userId) {
        User found = this.findById(userId);
        this.userRepository.delete(found);

        log.info("L'utente è stato eliminato correttamente!");
    }
}
