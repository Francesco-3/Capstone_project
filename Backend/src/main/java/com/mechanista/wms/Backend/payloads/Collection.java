package com.mechanista.wms.Backend.payloads;

import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.entities.Shelf;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record Collection(
        @NotNull(message = "La quantità di pezzi è obbligatoria!")
        Integer quantity,

        @NotBlank(message = "L'id del prodotto è obbligatorio!")
        Product id_product,

        Shelf id_shelf,
        Pallet id_pallet
) {
}
