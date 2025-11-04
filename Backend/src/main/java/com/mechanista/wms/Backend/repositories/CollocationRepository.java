package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Collocation;
import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.entities.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CollocationRepository extends JpaRepository<Collocation, UUID> {
    List<Collocation> findAllByProductId(Product productId);
    Optional<Collocation> findByShelfId(Shelf shelfId);
    Optional<Collocation> findByPalletId(Pallet palletId);
}
