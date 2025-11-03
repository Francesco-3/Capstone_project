package com.mechanista.wms.Backend.payloads;

import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.entities.Shelf;
import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.entities.enums.MovementType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

public record MovementDTO(
        @NotBlank(message = "L'id dell'operatore è obbligatorio!")
        User id_user,

        Shelf id_shelf,
        Pallet id_pallet,

        @NotBlank(message = "L'id del prodotto è obbligatorio!")
        Product id_product,

        @NotNull(message = "Il tipo di movimento è obbligatorio! (Prelievo, Aggiunta)")
        Set<MovementType> movementType,

        @NotNull(message = "La quantità è obbligatoria!")
        Integer quantity,

        @NotBlank(message = "La data è obbligatoria!")
        LocalDate date_time,

        String notes) {
}
