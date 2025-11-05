package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Section;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.PalletDTO;
import com.mechanista.wms.Backend.repositories.CollocationRepository;
import com.mechanista.wms.Backend.repositories.PalletRepository;
import com.mechanista.wms.Backend.repositories.SectionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class PalletService {
    @Autowired
    private PalletRepository palletRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private CollocationRepository collocationRepository;

    // CREATE
    public Pallet savePallet(PalletDTO payload) {
        if (palletRepository.findByPalletCode(payload.palletCode()).isPresent()) {
            throw new BadRequestException("Il pallet " + payload.palletCode() + " esiste già!");
        };

        // cerco la sezione di appartenenza
        Section section = sectionRepository.findById(payload.sectionId())
                .orElseThrow(() -> new NotFoundException("Sezione " + payload.sectionId() + " non trovata. Impossibile creare il Pallet."));

        // popolo il pallet
        Pallet newPallet = new Pallet();
        newPallet.setPalletCode(payload.palletCode());
        newPallet.setMaxRate(payload.maxRate());
        newPallet.setSectionId(section);

        // salvo
        Pallet savedPallet = palletRepository.save(newPallet);
        log.info("Il pallet " + savedPallet.getPalletCode() + " è stato creato con successo!");
        return savedPallet;
    }

    // READ
    public Page<Pallet> findAll(Pageable pageable) {
        return palletRepository.findAll(pageable);
    }

    public Pallet findById(UUID palletId) {
        return palletRepository.findById(palletId)
                .orElseThrow(() -> new NotFoundException("Pallet con l'id " + palletId + " non trovato!"));
    }

    public Pallet findByPalletCode(String palletCode) {
        return palletRepository.findByPalletCode(palletCode)
                .orElseThrow(() -> new NotFoundException("Pallet con codice " + palletCode + " non trovato!"));
    }

    // UPDATE
    public Pallet updatePallet(UUID palletId, PalletDTO payload) {
        Pallet found = this.findById(palletId);

        // cerco la sezione
        Section section = sectionRepository.findById(payload.sectionId())
                .orElseThrow(() -> new NotFoundException("Sezione con id " + payload.sectionId() + " non trovata."));

        // controllo che non ci siano duplicati
        if (!found.getPalletCode().equals(payload.palletCode()) &&
                palletRepository.findByPalletCode(payload.palletCode()).isPresent()) {
            throw new BadRequestException("Il codice pallet " + payload.palletCode() + " è già utilizzato!");
        }

        // modifico i dati
        found.setPalletCode(payload.palletCode());
        found.setMaxRate(payload.maxRate());
        found.setSectionId(section);

        // salvo
        Pallet modifiedPallet = palletRepository.save(found);
        log.info("Pallet " + modifiedPallet.getPalletCode() + " aggiornato con successo!");
        return modifiedPallet;
    }

    // DELETE
    public void delete(UUID palletId) {
        Pallet found = this.findById(palletId);

        // controllo se il pallet è presente in qualche collocazione
        int collocationCount = collocationRepository.findByPalletId(found).size();
        if (collocationCount > 0) {
            throw new BadRequestException("Impossibile eliminare il pallet " + found.getPalletCode() +
                    " perchè è associato a " + collocationCount + " collocazioni di pordotti!");
        }

        // elimino
        palletRepository.delete(found);
        log.info("Pallet eliminato con successo!");
    }
}
