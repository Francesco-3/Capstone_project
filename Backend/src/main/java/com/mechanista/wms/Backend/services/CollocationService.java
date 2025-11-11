package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.*;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.CollocationDTO;
import com.mechanista.wms.Backend.repositories.CollocationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

        if (existingCollocation.isPresent()) {
            UUID found = existingCollocation.get().getId_collocation();
            if (existingCollocationId.isEmpty() || !existingCollocationId.get().equals(found)) {
                throw new BadRequestException("Il prodotto  è già collocato nella posizione specificata!");
            }
        }

        // popolo e ritorno l'entità
        Collocation newCollocation = new Collocation();
        newCollocation.setProductId(product);
        newCollocation.setShelfId(shelf); // può essere null
        newCollocation.setPalletId(pallet); // può essere null
        newCollocation.setQuantity(payload.quantity());

        return newCollocation;
    }

    // CREATE
    public Collocation saveCollocation(CollocationDTO payload) {
        Collocation newCollocation = this.mapToEntity(payload, Optional.empty());
        Collocation saved = collocationRepository.save(newCollocation);

        log.info("Collocazione creata con successo per Prodotto ID {} in Mensola ID {} o Pallet ID {}!",
                saved.getProductId().getId_product(), saved.getShelfId().getId_shelf(), saved.getPalletId().getId_pallet());
        return saved;
    }

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
