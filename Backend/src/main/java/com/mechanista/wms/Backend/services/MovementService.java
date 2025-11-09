package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.*;
import com.mechanista.wms.Backend.entities.enums.MovementType;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.exceptions.NotFoundException;
import com.mechanista.wms.Backend.payloads.MovementDTO;
import com.mechanista.wms.Backend.repositories.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class MovementService {
    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ShelfService shelfService;

    @Autowired
    private PalletService palletService;

    // mappatura delle entità, questo metodo non salva i dati nel db, ma li prepara e li valida
    private Movement mapToEntity(MovementDTO payload, Optional<UUID> existingMovementId) {
        // recupero il prodotto
        Product product = productService.findById(payload.productId());

        // recupero l'utente (obbligatoriamente)
        User user = userService.findById(payload.userId());

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
        Optional<Movement> existingMovement = movementRepository
                .findByUserIdAndProductIdAndShelfIdAndPalletId(user, product, shelf, pallet);

        if (existingMovement.isPresent()) {
            UUID found = existingMovement.get().getId_movement();
            if (existingMovementId.isEmpty() || !existingMovementId.get().equals(found)) {
                throw new BadRequestException("Esiste già un movimento per questo prodotto e utente nella stessa posizione!");
            }
        }

        Movement newMovement = new Movement();
        newMovement.setProductId(product);
        newMovement.setShelfId(shelf);
        newMovement.setUserId(user);
        newMovement.setQuantity(payload.quantity());
        newMovement.setMovementType(payload.movementType());
        newMovement.setDate(payload.date_time());

        return newMovement;
    }

    // CREATE
    public Movement saveMovement(MovementDTO payload) {
        Movement newMovement = this.mapToEntity(payload, Optional.empty());
        Movement saved = movementRepository.save(newMovement);

        log.info("Movimento creato con successo dall'utente " + saved.getUserId() + " per il prodotto " + saved.getProductId());
        return saved;
    }

    // READ
    public Page<Movement> findAll(Pageable pageable) {
        return movementRepository.findAll(pageable);
    }

    public Movement findById(UUID movementId) {
        return movementRepository.findById(movementId).orElseThrow(() -> new NotFoundException(movementId));
    }

    public Page<Movement> findByUserId(UUID userId, Pageable pageable) {
        User user = userService.findById(userId);
        return movementRepository.findByUserId(user, pageable);
    }

    public Page<Movement> findByMovementType(MovementType type, Pageable pageable) {
        return movementRepository.findByMovementType(type, pageable);
    }

    public Page<Movement> findByDate(LocalDate date, Pageable pageable) {
        return movementRepository.findByDate(date, pageable);
    }

    public Page<Movement> findByProductId(Product product, Pageable pageable) {
        return movementRepository.findByProductId(product, pageable);
    }

    //UPDATE
    public Movement findByIdAndUpdate(UUID movementId, MovementDTO payload) {
        Movement found = this.mapToEntity(payload, Optional.of(movementId));

        found.setId_movement(movementId);
        found = movementRepository.save(found);

        log.info("Movimento aggiornato correttamente!");
        return found;
    }

    // DELETE
    public void findByIdAndDelete(UUID movementId) {
        Movement found = this.findById(movementId);

        movementRepository.delete(found);
        log.info("L'utente " + found.getUserId() + " ha eliminato il movimento " + found.getId_movement());
    }
}
