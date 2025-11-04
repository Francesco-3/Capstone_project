package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Movement;
import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.entities.User;
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

    List<Movement> findByUserId(User userId);
    List<Movement> findByMovementType(MovementType movementType);
    List<Movement> findByDate(LocalDate date);

    Optional<Movement> findByProductId(Product productId);
}
