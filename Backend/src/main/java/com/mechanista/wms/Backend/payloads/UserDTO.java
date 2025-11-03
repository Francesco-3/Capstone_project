package com.mechanista.wms.Backend.payloads;

import com.mechanista.wms.Backend.entities.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Set;

public record UserDTO(
        @NotBlank(message = "Il campo username non può essere vuoto")
        @Size(min = 2, max = 10, message = "L'username deve avere tra 2 e 10 caratteri.")
        String username,

        @NotBlank(message = "La password è obbligatoria!")
        @Size(min = 5, message = "La password deve avere minimo 5 caratteri")
        @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$", message = "La password deve contenere una maiuscola, una minuscola, un numero e un carattere speciale!")
        String password,

        @NotBlank(message = "L'email è obbligatoria.")
        @Email(message = "Il formato dell'email non è valido.")
        @Size(max = 50, message = "L'email non può superare i 50 caratteri.")
        String email,

        Set<UserRole> role,
        LocalDate creation_date
) {
}
