package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.*;
import com.mechanista.wms.Backend.entities.enums.MovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface MovementRepository extends JpaRepository<Movement, UUID> {
    Page<Movement> findByUserId(User userId, Pageable pageable);
    Page<Movement> findByProductId(Product productId, Pageable pageable);
    Page<Movement> findByMovementType(MovementType type, Pageable pageable);
    Page<Movement> findByDate(LocalDate date, Pageable pageable);

    Optional<Movement> findByUserIdAndProductIdAndShelfIdAndPalletId(User userId, Product productId, Shelf shelfId, Pallet palletId);
}
