package com.mechanista.wms.Backend.payloads;

import com.mechanista.wms.Backend.entities.enums.MovementType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record MovementDTO(
        UUID userId,

        UUID shelfId,
        UUID palletId,

        UUID productId,

        @NotNull(message = "Il tipo di movimento è obbligatorio! (Prelievo, Aggiunta)")
        MovementType movementType,

        @NotNull(message = "La quantità è obbligatoria!")
        Integer quantity,

        @NotNull(message = "La data è obbligatoria!")
        LocalDate date_time,

        String notes) {
}
