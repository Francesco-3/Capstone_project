package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.Section;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.SectionDTO;
import com.mechanista.wms.Backend.repositories.PalletRepository;
import com.mechanista.wms.Backend.repositories.RackRepository;
import com.mechanista.wms.Backend.repositories.SectionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class SectionService {
    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private RackRepository rackRepository;

    @Autowired
    private PalletRepository palletRepository;

    // CREATE
    public Section saveSection(SectionDTO sectionDTO) {
        // controllo se la sezione esiste
        if (sectionRepository.findBySectionCode(sectionDTO.sectionCode()).isPresent()) {
            throw new BadRequestException("La sezione " + sectionDTO.sectionCode() + " esiste già!");
        }

        // creo la sezione
        Section section = new Section();
        section.setSectionCode(sectionDTO.sectionCode());
        section.setDescription(sectionDTO.description());

        // salvo
        Section savedSection = sectionRepository.save(section);
        log.info("Sezione '{}' creata con successo con l'id: {}", savedSection.getSectionCode(), savedSection.getId_section());
        return savedSection;
    }

    // READ
    public Page<Section> findAll(Pageable pageable) {
        return sectionRepository.findAll(pageable);
    }

    public Section findById(UUID sectionId) {
        return sectionRepository.findById(sectionId)
                .orElseThrow(() -> new NotFoundException("La sezione " + sectionId + " non è stata trovata!"));
    }

    public Section findBySectionCode(String sectionCode) {
        return sectionRepository.findBySectionCode(sectionCode)
                .orElseThrow(() -> new NotFoundException("La sezione " + sectionCode + " non è stata trovata!"));
    }

    // UPDATE
    public Section findByIdAndUpdate(UUID sectionId, SectionDTO payload) {
        Section found = this.findById(sectionId);

        // controllo che non ci siano duplicati
        if (!found.getSectionCode().equals(payload.sectionCode())) {
            this.sectionRepository.findBySectionCode(payload.sectionCode())
                    .ifPresent(section -> {
                        throw new BadRequestException("La sezione " + section.getSectionCode() + " è già in uso!");
                    });
        }

        // modifico i campi
        found.setSectionCode(payload.sectionCode());
        found.setDescription(payload.description());

        // salvo la modifica
        Section updateSection = this.sectionRepository.save(found);
        log.info("La sezione è stata aggiornato!");
        return updateSection;
    }

    // DELETE
    public void findByIdAndDelete(UUID sectionId) {
        Section found = this.findById(sectionId);

        // controllo che la sezione non sia assegnata a nessun rack
       /* if (rackRepository.findBySectionId(found).isPresent()) {
            throw new BadRequestException("Impossibile eliminare la sezione '" + found.getSectionCode() +
                    "' perché è assegnata a uno o più rack.");
        }*/

        // controllo che la sezione non sia assegnata a nessun pallet
        if (palletRepository.findBySectionId(found).isPresent()) {
            throw new BadRequestException("Impossibile eliminare la sezione '" + found.getSectionCode() +
                    "' perché è assegnata a uno o più pallet.");
        }

        // elimino la sezione
        sectionRepository.delete(found);
        log.info("La sezione è stata eliminata!");
    }
}
