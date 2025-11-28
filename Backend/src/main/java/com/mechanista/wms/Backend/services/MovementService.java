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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import necessario

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

    // *** INIEZIONE AGGIUNTA ***
    @Autowired
    private CollocationService collocationService;

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

        /* controllo duplicati
        Optional<Movement> existingMovement = movementRepository
                .findByUserIdAndProductIdAndShelfIdAndPalletId(user, product, shelf, pallet);

        if (existingMovement.isPresent()) {
            UUID found = existingMovement.get().getId_movement();
            if (existingMovementId.isEmpty() || !existingMovementId.get().equals(found)) {
                throw new BadRequestException("Esiste già un movimento per questo prodotto e utente nella stessa posizione!");
            }
        }*/

        Movement newMovement = new Movement();
        newMovement.setProductId(product);
        newMovement.setShelfId(shelf);
        newMovement.setPalletId(pallet); // Assicurati di impostare il PalletId
        newMovement.setUserId(user);
        newMovement.setQuantity(payload.quantity());
        newMovement.setMovementType(payload.movementType());
        newMovement.setDate(payload.date_time());

        return newMovement;
    }

    // CREATE (Metodo originale di salvataggio, ora transazionale e completo)
    @Transactional
    public Movement saveMovement(MovementDTO payload) {
        // 1. Mappa il payload in una Movement entity
        Movement newMovement = this.mapToEntity(payload, Optional.empty());

        Product product = newMovement.getProductId();
        Shelf shelf = newMovement.getShelfId();
        Pallet pallet = newMovement.getPalletId();
        int quantity = newMovement.getQuantity();
        MovementType type = newMovement.getMovementType();

        // 2. Aggiorna la Collocazione (il ripiano/pallet specifico)
        // Se l'operazione fallisce (es. quantità insufficiente), l'intera transazione viene annullata.
        collocationService.handleMovement(product, shelf, pallet, quantity, type);

        // 3. Aggiorna la quantità totale sul Prodotto
        if (type == MovementType.INBOUND) {
            productService.increaseTotalStock(product.getId_product(), quantity);
        } else if (type == MovementType.OUTBOUND) {
            productService.decreaseTotalStock(product.getId_product(), quantity);
        }

        // 4. Salva il Movimento
        Movement saved = movementRepository.save(newMovement);

        log.info("Movimento di tipo {} creato con successo per il prodotto {}", type, saved.getProductId().getProductCode());
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
        // NB: un aggiornamento di un movimento esistente è complesso e richiederebbe una gestione
        // inversa dello stock e della collocazione. Per ora, il metodo aggiorna solo il record Movement.
        Movement found = this.mapToEntity(payload, Optional.of(movementId));

        found.setId_movement(movementId);
        found = movementRepository.save(found);

        log.info("Movimento aggiornato correttamente!");
        return found;
    }

    // DELETE
    public void findByIdAndDelete(UUID movementId) {
        // NB: L'eliminazione di un movimento esistente richiederebbe un roll-back dello stock e della collocazione.
        Movement found = this.findById(movementId);

        movementRepository.delete(found);
        log.info("L'utente " + found.getUserId() + " ha eliminato il movimento " + found.getId_movement());
    }
}