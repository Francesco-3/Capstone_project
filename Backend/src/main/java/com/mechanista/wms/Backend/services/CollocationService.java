package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Collocation;
import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.entities.Shelf;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.CollocationDTO;
import com.mechanista.wms.Backend.repositories.CollocationRepository;
import com.mechanista.wms.Backend.repositories.PalletRepository;
import com.mechanista.wms.Backend.repositories.ProductRepository;
import com.mechanista.wms.Backend.repositories.ShelfRepository;
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
    private ProductRepository productRepository;

    @Autowired
    private ShelfRepository shelfRepository;

    @Autowired
    private PalletRepository palletRepository;

    // metodo per trovare le entità correlate e popolare l'oggetto Collocation
    private Collocation mapToEntity(CollocationDTO payload, Optional<UUID> existingCollocationId) {

        // cerco il prodotto
        Product product = productRepository.findById(payload.productId())
                .orElseThrow(() -> new NotFoundException("Prodotto " + payload.productId() + " non trovato."));

        // cerco la mensola
        Shelf shelf = null;
        if (payload.shelfId() != null) {
            shelf = shelfRepository.findById(payload.shelfId())
                    .orElseThrow(() -> new NotFoundException("Mensola " + payload.shelfId() + " non trovata."));
        }

        // cerco il pallet
        Pallet pallet = null;
        if (payload.palletId() != null) {
            pallet = palletRepository.findById(payload.palletId())
                    .orElseThrow(() -> new NotFoundException("Pallet " + payload.palletId() + " non trovato."));
        }

        // controllo duplicati
        Optional<Collocation> existingCollocation = collocationRepository.findByProductIdAndShelfIdAndPalletId(product, shelf, pallet);

        if (existingCollocation.isPresent()) {
            UUID found = existingCollocation.get().getId_collocation();
            if (existingCollocationId.isEmpty() || !existingCollocationId.get().equals(found)) {
                throw new BadRequestException("Il prodotto " + product.getId_product() +
                        " è già collocato nella posizione specificata!");
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

        Collocation savedCollocation = collocationRepository.save(newCollocation);
        log.info("Collocazione creata con successo per Prodotto ID {} in Mensola ID {} o Pallet ID {}!",
                savedCollocation.getProductId().getId_product(), savedCollocation.getShelfId().getId_shelf(), savedCollocation.getPalletId().getId_pallet());
        return savedCollocation;
    }

    // READ
    public Page<Collocation> findAll(Pageable pageable) {
        return collocationRepository.findAll(pageable);
    }

    public Collocation findById(UUID collocationId) {
        return collocationRepository.findById(collocationId)
                .orElseThrow(() -> new NotFoundException("Collocazione " + collocationId + " non trovata!"));
    }

    // UPDATE
    public Collocation updateCollocation(UUID collocationId, CollocationDTO payload) {
        // mapToEntity gestisce la ricerca dei componenti e il controllo duplicati
        Collocation found = this.mapToEntity(payload, Optional.of(collocationId));

        // salvo modifica
        found = collocationRepository.save(found);
        log.info("Collocazione aggiornata con successo!");
        return found;
    }

    // DELETE
    public void delete(UUID collocationId) {
        Collocation found = this.findById(collocationId);

        // elimino
        collocationRepository.delete(found);
        log.info("Collocazione eliminata con successo!");
    }
}
