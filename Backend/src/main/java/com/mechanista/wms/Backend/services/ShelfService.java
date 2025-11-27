package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Rack;
import com.mechanista.wms.Backend.entities.Shelf;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.ShelfDTO;
import com.mechanista.wms.Backend.repositories.CollocationRepository;
import com.mechanista.wms.Backend.repositories.RackRepository;
import com.mechanista.wms.Backend.repositories.ShelfRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ShelfService {
    @Autowired
    private ShelfRepository shelfRepository;

    @Autowired
    private RackRepository rackRepository;

    @Autowired
    private CollocationRepository collocationRepository;

    // CREATE
    public Shelf saveShelf(ShelfDTO payload) {
        // cerco il rack
        Rack rack = rackRepository.findById(payload.rackId())
                .orElseThrow(() -> new NotFoundException("Scaffale " + payload.rackId() + " non trovato. Impossibile creare la Mensola."));

        // Controllo duplicati codice
        if (shelfRepository.findByShelfNumber(payload.shelfNumber()).isPresent()) {
            throw new BadRequestException("La sezione " + payload.shelfNumber() + " esiste già!");
        }

        // popolo
        Shelf newShelf = new Shelf();
        newShelf.setRackId(rack);
        newShelf.setShelfNumber(payload.shelfNumber());
        newShelf.setCapacity(payload.capacity());

        // salvo
        Shelf savedShelf = shelfRepository.save(newShelf);
        log.info("Mensola " + savedShelf.getShelfNumber() + " creata per Scaffale " + savedShelf.getRackId());
        return savedShelf;
    }

    // READ
    public Page<Shelf> findAll(Pageable pageable) {
        return shelfRepository.findAll(pageable);
    }

    public Shelf findById(UUID shelfId) {
        return shelfRepository.findById(shelfId)
                .orElseThrow(() -> new NotFoundException("Mensola " + shelfId + " non trovata!"));
    }

    public Shelf findByShelfNumber(int shelfNumber) {
        return shelfRepository.findByShelfNumber(shelfNumber)
                .orElseThrow(() -> new NotFoundException("Mensola n. " + shelfNumber + " non trovata!"));
    }

    public List<Shelf> findByRackId(Rack rackId) {
        return shelfRepository.findByRackId(rackId);
    }


    // UPDATE
    public Shelf findByIdAndUpdate(UUID shelfId, ShelfDTO payload) {
        Shelf found = this.findById(shelfId);

        // cerco il rack
        Rack rack = rackRepository.findById(payload.rackId())
                .orElseThrow(() -> new NotFoundException("Scaffale " + payload.rackId() + " non trovato."));

        // modifico i dati
        found.setRackId(rack);
        found.setShelfNumber(payload.shelfNumber());
        found.setCapacity(payload.capacity());

        // salvo
        Shelf modifiedShelf = shelfRepository.save(found);
        log.info("Mensola aggiornata correttamente!");
        return modifiedShelf;
    }

    // DELETE
    public void findByIdAndDelete(UUID shelfId) {
        Shelf found = this.findById(shelfId);

        // controllo se lo shelf è presente in qualche collocation
        if (collocationRepository.existsByShelfId(found)) {
            throw new BadRequestException(
                    "Impossibile eliminare la mensola " + found.getId_shelf() +
                            " perché contiene già un prodotto!"
            );
        }

        // elimino
        shelfRepository.delete(found);
        log.info("Mensola eliminata con successo");
    }
}
