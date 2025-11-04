package com.mechanista.wms.Backend.entities;

import com.mechanista.wms.Backend.entities.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table
@Getter
@Setter
@ToString(exclude = {"users"})
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue
    private UUID id_role;

    @Column(unique = true, nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    private String name;

    @ManyToMany(mappedBy = "roles", cascade = CascadeType.ALL)
    private List<User> users = new ArrayList<>();

    public Role(UserRole userRole) {
        this.userRole = userRole;
        this.name = userRole != null ? userRole.name() : null;
    }
}
