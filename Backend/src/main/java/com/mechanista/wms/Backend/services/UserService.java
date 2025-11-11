package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Collocation;
import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.entities.enums.UserRole;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.UserDTO;
import com.mechanista.wms.Backend.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private PasswordEncoder bcrypt;

    // CREATE
    public User saveUser(UserDTO payload) {
        // controllo se esiste già un utente con questa email
        userRepository.findByEmail(payload.email()).ifPresent(user -> {
            throw new BadRequestException("L'email " + user.getEmail() + " è già registrata!");
        });

        // creo il nuovo utente con i dati inseriti
        User newUser = new User(
                payload.username(),
                payload.email(),
                bcrypt.encode(payload.password()),
                payload.role() != null ? payload.role() : UserRole.MECHANICAL, // default WORKER
                payload.creation_date() != null ? payload.creation_date() : LocalDate.now()
        );


        User saved = this.userRepository.save(newUser);
        log.info("L'utente " + saved.getUsername() + " è stato salvato correttamente con il ruolo: " + saved.getRole());
        return saved;
    }

    // READ
    public User findById(UUID userId) {
        return userRepository.findById(userId).orElseThrow(() -> new NotFoundException(userId));
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email).orElseThrow(() ->
                new NotFoundException("L'utente con l'email " + email + " non è stato trovato"));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Utente con username " + username + " non trovato."));
    }

    public Page<User> findByRole(UserRole userRole, Pageable pageable) {
        return userRepository.findByRole(userRole, pageable);
    }

    // UPDATE
    public User findByIdAndUpdate(UUID userId, UserDTO payload) {
        User found = this.findById(userId);

        // controllo email duplicata solo se cambiata
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

        if (payload.role() != null) {
            found.setRole(payload.role());
        }

        User modified = this.userRepository.save(found);
        log.info("L'utente " + modified.getUsername() + " è stato aggiornato correttamente!");
        return modified;
    }

    // DELETE
    public void findIdAndDelete(UUID userId) {
        User found = this.findById(userId);
        this.userRepository.delete(found);

        log.info("L'utente è stato eliminato correttamente!");
    }
}
