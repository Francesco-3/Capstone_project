package com.mechanista.wms.Backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mechanista.wms.Backend.entities.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@Getter
@Setter
@ToString(exclude = {"roles"})
@NoArgsConstructor
@JsonIgnoreProperties({"password", "authorities", "enabled", "accountNonLocked", "accountNonExpired", "credentialsNonExpired"})
public class User implements UserDetails {
    @Id
    @GeneratedValue
    private UUID id_user;

    private String username;

    @Column(nullable = false)
    private String password;
    @Column(unique = true, nullable = false)
    private String email;

    private LocalDate creation_date;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "id_user"),
            inverseJoinColumns = @JoinColumn(name = "id_role")
    )
    @JsonIgnore
    private List<Role> roles = new ArrayList<>();

    public User(String username, String password, String email, LocalDate creation_date) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.creation_date = creation_date;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getUserRole().name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() { return this.username; }
}
