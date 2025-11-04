package com.mechanista.wms.Backend.payloads;

import com.mechanista.wms.Backend.entities.Section;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PalletDTO(
        @NotBlank(message = "Il codice del pallet è obbligatorio! (P01, P02...)")
        String palletCode,

        double maxRate,

        @NotNull(message = "L'id della sezione non può essere vuoto!")
        UUID sectionId) {
}
