package com.mechanista.wms.Backend.payloads;

import com.mechanista.wms.Backend.entities.Section;
import jakarta.validation.constraints.NotBlank;

public record RackDTO(
        @NotBlank(message = "Il codice del ripiano è obbligatorio! (S01, S12, S55...)")
        String shelfCode,

        @NotBlank(message = "L'id della sezione è obbligatoria!")
        Section id_section) {
}
