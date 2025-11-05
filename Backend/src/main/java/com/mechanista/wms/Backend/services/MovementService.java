package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.*;
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
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class MovementService {
    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    //CREATE
    public Movement saveMovement(MovementDTO payload) {
        User user = userRepository.findById(payload.userId())
                .orElseThrow(() -> new RuntimeException("Utente " + payload.userId() + " non trovato!"));

        Product product = productRepository.findById(payload.productId())
                .orElseThrow(() -> new RuntimeException("Prodotto " + payload.productId() + " non trovato!"));

        // cerco i movimenti disponibili
        List<Movement> assignedMovement = List.of();
        if (payload.movementType() != null && !payload.movementType().isEmpty()) {
            assignedMovement = payload.movementType().stream()
                    .map(movementType -> movementRepository.findByMovementType(movementType)
                            .orElseThrow(() -> new RuntimeException("Il movimento " + movementType + " non si trova nel database!")))
                    .toList();
        }

        // se non ne ha, assegno un tipo di movimento
//        if (assignedMovement.isEmpty()) {
//            Movement movement = movementRepository.findByMovementType(MovementType.WITHDRAWAL)
//                    .orElseGet(() -> movementRepository.save(new Movement(MovementType.ADDED)));
//            assignedMovement = List.of(movement);
//        }

        // popolo i dati
        Movement newMovement = new Movement();
        newMovement.setUserId(user);
        newMovement.setProductId(product);
        newMovement.setQuantity(payload.quantity());
        newMovement.setDate(payload.date_time());
//        newMovement.setMovementType(assignedMovement);

        // salvo
        Movement saveMovement = this.movementRepository.save(newMovement);
        log.info("L'utente " + saveMovement.getUserId() + " ha compiuto un '" + saveMovement.getMovementType() + "'!");
        return saveMovement;
    }

    // READ
    public Page<Movement> findAll(Specification<Movement> spec, Pageable pageable) {
        return movementRepository.findAll(spec, pageable);
    }

    public Movement findById(UUID movementId) {
        return movementRepository.findById(movementId).orElseThrow(() -> new NotFoundException(movementId));
    }

    public Movement findByUserId(User userId) {
        return movementRepository.findByUserId(userId).orElseThrow(() ->
                new NotFoundException("L'utente " + userId + " non è stato trovato!"));
    }

    public Movement findByDate(LocalDate date) {
        return movementRepository.findByDate(date).orElseThrow(() ->
                new NotFoundException("La data " + date + " non è stata trovata!"));
    }

    public Movement findByProductId(Product productId) {
        return movementRepository.findByProductId(productId).orElseThrow(() ->
                new NotFoundException("Il prodotto " + productId + "non è stato trovato!"));
    }

    //UPDATE
    public Movement findByIdAndUpdate(UUID movementId, MovementDTO payload) {
        Movement found = this.findById(movementId);

        //aggiungere il controllo

        found.setDate(payload.date_time());
        found.setQuantity(payload.quantity());
        found.setNotes(payload.notes());

        Movement modifierMovement = this.movementRepository.save(found);
        log.info("L'utente " + modifierMovement.getUserId() + " ha aggiornato un movimento!");
        return modifierMovement;
    }

    // DELETE
    public void findIdAndDelete(UUID movementId) {
        Movement found = this.findById(movementId);
        this.movementRepository.delete(found);

        log.info("L'utente " + found.getUserId() + " ha eliminato un movimento!");
    }
}
