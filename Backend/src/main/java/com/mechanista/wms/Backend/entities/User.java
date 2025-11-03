package com.mechanista.wms.Backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mechanista.wms.Backend.entities.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@ToString
@NoArgsConstructor
@JsonIgnoreProperties({"password", "authorities", "enabled", "accountNonLocked", "accountNonExpired", "credentialsNonExpired"})
public class User {
    @Id
    @GeneratedValue
    private UUID id_user;

    private String username;

    @Column(nullable = false)
    private String password;
    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private LocalDate creation_date;

    public User(String username, String password, String email, UserRole role, LocalDate creation_date) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.creation_date = creation_date;
    }
}
