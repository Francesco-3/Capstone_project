package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Rack;
import com.mechanista.wms.Backend.entities.Section;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.RackDTO;
import com.mechanista.wms.Backend.repositories.RackRepository;
import com.mechanista.wms.Backend.repositories.SectionRepository;
import com.mechanista.wms.Backend.repositories.ShelfRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class RackService {
    @Autowired
    private RackRepository rackRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private ShelfRepository shelfRepository;

    // CREATE
    public Rack saveRack(RackDTO payload) {
        if (rackRepository.findByShelfCode(payload.shelfCode()).isPresent()) {
            throw new BadRequestException("Rack con codice " + payload.shelfCode() + " esiste già!");
        };

        // cerco la sezione di appartenenza
        Section section = sectionRepository.findById(payload.sectionId())
                .orElseThrow(() -> new NotFoundException("Sezione " + payload.sectionId() + " non trovata. Impossibile creare il Rack."));

        // popolo il rack
        Rack rack = new Rack();
        rack.setShelfCode(payload.shelfCode());
        rack.setSectionId(section);

        // salvo
        Rack savedRack = rackRepository.save(rack);
        log.info("Rack " + savedRack.getShelfCode() + " creata correttamente!");
        return savedRack;
    }

    // READ
    public Page<Rack> findAll(Pageable pageable) {
        return rackRepository.findAll(pageable);
    }

    public Rack findById(UUID rackId) {
        return rackRepository.findById(rackId)
                .orElseThrow(() -> new NotFoundException("Rack con l'id " + rackId + " non trovato!"));
    }

    public Rack findByShelfCode(String shelfCode) {
        return rackRepository.findByShelfCode(shelfCode)
                .orElseThrow(() -> new NotFoundException("Rack " + shelfCode + " non trovato!"));
    }

    // UPDATE
    public Rack findByIdAndUpdate(UUID rackId, RackDTO payload) {
        Rack found = this.findById(rackId);

        // cerco la nuova sezione
        Section section = sectionRepository.findById(payload.sectionId())
                .orElseThrow(() -> new NotFoundException("Sezione " + payload.sectionId() + " non trovata."));

        // Controllo duplicati
        if (!found.getShelfCode().equals(payload.shelfCode()) &&
                rackRepository.findByShelfCode(payload.shelfCode()).isPresent()) {
            throw new BadRequestException("Il codice " + payload.shelfCode() + " è già utilizzato!");
        }

        // modifico i dati
        found.setShelfCode(payload.shelfCode());
        found.setSectionId(section);

        // salvo
        Rack modifiedRack = rackRepository.save(found);
        log.info("Rack aggiornata correttamente");
        return modifiedRack;
    }

    // DELETE
    public void findByIdAndDelete(UUID rackId) {
        Rack rack = this.findById(rackId);

        // controllo che il rack non sia assegnato
        if (shelfRepository.findByRackId(rack).isPresent()) {
            throw new BadRequestException("Impossibile eliminare il rack '" + rack.getShelfCode() +
                    "' perché contiene una o più mensole.");
        }

        // elimino
        rackRepository.delete(rack);
        log.info("Rack eliminata con successo");
    }
}
