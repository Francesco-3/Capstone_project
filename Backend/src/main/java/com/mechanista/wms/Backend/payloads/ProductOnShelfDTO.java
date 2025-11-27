package com.mechanista.wms.Backend.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class ProductOnShelfDTO {
    private UUID idProduct;
    private String productName;
    private String productCode;
    private int quantity;
}
