package com.mechanista.wms.Backend.payloads;

import jakarta.validation.constraints.NotBlank;

public record RoleDTO(
        @NotBlank(message = "Il nome del ruolo è obbligatorio!")
        String name) {
}
