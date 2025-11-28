package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.*;
import com.mechanista.wms.Backend.entities.enums.MovementType; // Import necessario
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.CollocationDTO;
import com.mechanista.wms.Backend.payloads.ProductOnShelfDTO;
import com.mechanista.wms.Backend.repositories.CollocationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import necessario

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class CollocationService {
    @Autowired
    private CollocationRepository collocationRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ShelfService shelfService;

    @Autowired
    private PalletService palletService;

    // metodo per trovare le entità correlate e popolare l'oggetto Collocation
    private Collocation mapToEntity(CollocationDTO payload, Optional<UUID> existingCollocationId) {

        // cerco il prodotto
        Product product = productService.findById(payload.productId());

        // recupero la mensola o il pallet
        Shelf shelf = payload.shelfId() != null ? shelfService.findById(payload.shelfId()) : null;
        Pallet pallet = payload.palletId() != null ? palletService.findById(payload.palletId()) : null;

        // controllo che almeno uno dei due venga popolato
        if (shelf == null && pallet == null) {
            throw new BadRequestException("Devi specificare la mensola o il pallet di destinazione del prodotto!");
        }

        if (shelf != null && pallet != null) {
            throw new BadRequestException("Il movimento può riguardare solo una destinazione alla volta!");
        }

        // controllo duplicati
        Optional<Collocation> existingCollocation = collocationRepository
                .findByProductIdAndShelfIdAndPalletId(product, shelf, pallet);

       /* if (existingCollocation.isPresent()) {
            UUID found = existingCollocation.get().getId_collocation();
            if (existingCollocationId.isEmpty() || !existingCollocationId.get().equals(found)) {
                throw new BadRequestException("Il prodotto  è già collocato nella posizione specificata!");
            }
        }*/

        // popolo e ritorno l'entità
        Collocation newCollocation = new Collocation();
        newCollocation.setProductId(product);
        newCollocation.setShelfId(shelf); // può essere null
        newCollocation.setPalletId(pallet); // può essere null
        newCollocation.setQuantity(payload.quantity());

        return newCollocation;
    }

    // CREATE (Metodo originale per la creazione manuale di Collocation)
    public Collocation saveCollocation(CollocationDTO payload) {
        Collocation newCollocation = this.mapToEntity(payload, Optional.empty());
        Collocation saved = collocationRepository.save(newCollocation);

        log.info("Collocazione creata con successo per Prodotto ID {}!", saved.getProductId().getId_product());
        return saved;
    }

    // ***************************************************************
    // *** METODO AGGIUNTO: Gestisce l'aggiornamento della Collocazione ***
    // ***************************************************************
    @Transactional
    public Collocation handleMovement(Product product, Shelf shelf, Pallet pallet, int quantityChange, MovementType type) {

        // 1. Cerca la collocazione esistente
        Optional<Collocation> existingCollocationOpt;

        if (shelf != null && pallet == null) {
            // Ricerca per ripiano (usato nella Sezione A)
            existingCollocationOpt = collocationRepository.findByProductIdAndShelfId(product, shelf);
        } else if (pallet != null) {
            // Ricerca per pallet (usato altrove, ma gestito in modo generico)
            existingCollocationOpt = collocationRepository.findByProductIdAndShelfIdAndPalletId(product, shelf, pallet);
        } else {
            throw new BadRequestException("La collocazione richiede uno ShelfId o un PalletId.");
        }

        Collocation collocation;
        int newQuantity;

        if (type == MovementType.INBOUND) {
            // --- MOVIMENTO DI CARICO (INBOUND) ---
            if (existingCollocationOpt.isPresent()) {
                // Collocazione esistente: incrementa la quantità
                collocation = existingCollocationOpt.get();
                newQuantity = collocation.getQuantity() + quantityChange;
                collocation.setQuantity(newQuantity);
                collocation = collocationRepository.save(collocation);
            } else {
                // Nuova collocazione: crea un nuovo record
                collocation = new Collocation();
                collocation.setProductId(product);
                collocation.setShelfId(shelf);
                collocation.setPalletId(pallet);
                collocation.setQuantity(quantityChange);
                collocation = collocationRepository.save(collocation);
                log.info("Creata nuova collocazione per prodotto {} sul ripiano/pallet", product.getProductCode());
            }
        } else if (type == MovementType.OUTBOUND) {
            // --- MOVIMENTO DI SCARICO (OUTBOUND) ---
            if (existingCollocationOpt.isEmpty()) {
                throw new BadRequestException("Nessuna collocazione trovata per il prodotto " + product.getProductCode() + " nella posizione specificata per lo scarico.");
            }

            collocation = existingCollocationOpt.get();
            newQuantity = collocation.getQuantity() - quantityChange;

            if (newQuantity < 0) {
                throw new BadRequestException("Quantità di scarico (" + quantityChange + ") superiore alla quantità disponibile nella collocazione (" + collocation.getQuantity() + ")!");
            } else if (newQuantity == 0) {
                // Quantità esaurita: elimina la Collocazione dal DB
                collocationRepository.delete(collocation);
                log.info("Collocazione eliminata (quantità a zero) per prodotto {}", product.getProductCode());
                return null;
            } else {
                // Quantità residua: aggiorna la quantità
                collocation.setQuantity(newQuantity);
                collocation = collocationRepository.save(collocation);
                log.info("Collocazione per prodotto {} aggiornata a quantità {}", product.getProductCode(), newQuantity);
            }
        } else {
            throw new BadRequestException("Tipo di movimento non supportato per l'aggiornamento della collocazione.");
        }

        return collocation;
    }
    // ***************************************************************
    // *** FINE METODO AGGIUNTO ***
    // ***************************************************************


    // READ
    public Page<Collocation> findAll(Pageable pageable) {
        return collocationRepository.findAll(pageable);
    }

    public Collocation findById(UUID collocationId) {
        return collocationRepository.findById(collocationId).orElseThrow(() -> new NotFoundException(collocationId));
    }

    public Page<Collocation> findByProductId(Product productId, Pageable pageable) {
        return collocationRepository.findByProductId(productId, pageable);
    }

    public Page<Collocation> findByShelfId(Shelf shelfId, Pageable pageable) {
        return collocationRepository.findByShelfId(shelfId, pageable);
    }

    public Page<Collocation> findByPalletId(Pallet pallet, Pageable pageable) {
        return collocationRepository.findByPalletId(pallet, pageable);
    }

    // UPDATE
    public Collocation findByIdAndUpdate(UUID collocationId, CollocationDTO payload) {
        // mapToEntity gestisce la ricerca dei componenti e il controllo duplicati
        Collocation found = this.mapToEntity(payload, Optional.of(collocationId));

        // salvo la modifica
        found.setId_collocation(collocationId);
        found = collocationRepository.save(found);

        log.info("Collocazione aggiornata con successo!");
        return found;
    }

    // DELETE
    public void findByIdAndDelete(UUID collocationId) {
        Collocation found = this.findById(collocationId);

        // elimino
        collocationRepository.delete(found);
        log.info("Collocazione eliminata con successo!");
    }
}