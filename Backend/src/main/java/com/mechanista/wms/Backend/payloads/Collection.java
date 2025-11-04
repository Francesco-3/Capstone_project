package com.mechanista.wms.Backend.payloads;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record Collection(
        @NotNull(message = "La quantità di pezzi è obbligatoria!")
        Integer quantity,

        @NotBlank(message = "L'id del prodotto è obbligatorio!")
        UUID productId,

        UUID shelfId,
        UUID palletId) {
}
