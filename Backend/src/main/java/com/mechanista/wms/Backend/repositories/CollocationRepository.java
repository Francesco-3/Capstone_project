package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CollocationRepository extends JpaRepository<Collocation, UUID> {
    Page<Collocation> findAll(Specification<Collocation> spec, Pageable pageable);
    Page<Collocation> findByProductId(Product productId, Pageable pageable);
    Page<Collocation> findByShelfId(Shelf shelfId, Pageable pageable);
    Page<Collocation> findByPalletId(Pallet palletId, Pageable pageable);

    Optional<Collocation> findByProductIdAndShelfIdAndPalletId(Product productId, Shelf shelfId, Pallet palletId);

    boolean existsByShelfId(Shelf shelf);
    boolean existsByPalletId(Pallet pallet);
}
