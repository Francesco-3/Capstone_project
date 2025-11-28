package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.ProductDTO;
import com.mechanista.wms.Backend.repositories.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import necessario

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    // CREATE
    public Product saveProduct(ProductDTO payload) {
        if (productRepository.findByProductCode(payload.productCode()).isPresent()) {
            throw new BadRequestException("Il prodotto " + payload.productCode() + " esiste già!");
        }

        Product newProduct = new Product();
        newProduct.setProductCode(payload.productCode());
        newProduct.setProductName(payload.productName());
        newProduct.setPrice(payload.price());
        newProduct.setStock(payload.stock());
        newProduct.setMeasurement(payload.measurement());
        newProduct.setWeight(payload.weight());
        newProduct.setDescription(payload.description());
        newProduct.setInsertionDate(payload.insertionDate());

        Product saved = this.productRepository.save(newProduct);
        log.info("Il prodotto " + saved.getProductCode() + " è stato salvato correttamente!");
        return newProduct;
    }

    // READ
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product findById(UUID productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Prodotto " + productId + " non trovato!"));
    }

    public Product findByProductName(String productName) {
        return productRepository.findByProductName(productName)
                .orElseThrow(() -> new NotFoundException("Prodotto " + productName + " non trovato!"));
    }

    public List<Product> findByInsertionDate(LocalDate insertionDate) {
        List<Product> products = this.productRepository.findByInsertionDate(insertionDate);

        if (products.isEmpty()) {
            throw new NotFoundException("Nessun prodotto trovato per la data di inserimento: " + insertionDate);
        }

        return products;
    }

    public List<Product> findByPrice(double price) {
        List<Product> products = this.productRepository.findByPrice(price);

        if (products.isEmpty()) {
            throw new NotFoundException("Nessun prodotto trovato con il prezzo inserito: " + price);
        }

        return products;
    }

    public Product findByProductCode(String productCode) {
        return productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new NotFoundException("Il prodotto " + productCode + " non è presente nel database!"));
    }

    // UPDATE
    public Product findByIdAndUpdate(UUID productId, ProductDTO payload) {
        Product found = this.findById(productId);

        if (!found.getProductCode().equals(payload.productCode())) {
            this.productRepository.findByProductCode(payload.productCode())
                    .ifPresent(product -> {
                        throw new BadRequestException("Il codice prodotto " + product.getProductCode() + " è già in uso!");
                    });
        }

        found.setProductCode(payload.productCode());
        found.setProductName(payload.productName());
        found.setPrice(payload.price());
        found.setStock(payload.stock());
        found.setMeasurement(payload.measurement());
        found.setWeight(payload.weight());
        found.setDescription(payload.description());
        found.setInsertionDate(payload.insertionDate());

        Product modifierProduct = this.productRepository.save(found);
        log.info("Il prodotto è stato aggiornato correttamente");
        return modifierProduct;
    }

    // *** METODI AGGIUNTI PER LA GESTIONE DELLO STOCK TOTALE ***
    @Transactional
    public void increaseTotalStock(UUID productId, int quantity) {
        Product product = this.findById(productId);
        product.setStock(product.getStock() + quantity);
        productRepository.save(product);
        log.info("Stock totale per prodotto {} aumentato a {}", product.getProductCode(), product.getStock());
    }

    @Transactional
    public void decreaseTotalStock(UUID productId, int quantity) {
        Product product = this.findById(productId);
        int newStock = product.getStock() - quantity;

        if (newStock < 0) {
            throw new BadRequestException("Scarico non consentito: lo stock totale del prodotto " + product.getProductCode() + " non può diventare negativo.");
        }

        product.setStock(newStock);
        productRepository.save(product);
        log.info("Stock totale per prodotto {} diminuito a {}", product.getProductCode(), product.getStock());
    }
    // *** FINE METODI AGGIUNTI ***

    // DELETE
    public void findByIdAndDelete(UUID productId) {
        Product found = this.findById(productId);
        this.productRepository.delete(found);

        log.info("Il prodotto è stato eliminato correttamente!");
    }
}