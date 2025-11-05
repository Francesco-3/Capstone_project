package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.*;
import com.mechanista.wms.Backend.entities.enums.MovementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MovementRepository extends JpaRepository<Movement, UUID> {
    Page<Movement> findAll(Specification<Movement> spec, Pageable pageable);

    Optional<Movement> findByUserId(User userId);
    Optional<Movement> findByDate(LocalDate date);
    Optional<Movement> findByProductId(Product productId);
    Optional<Movement> findByMovementType(MovementType movementType);
}
