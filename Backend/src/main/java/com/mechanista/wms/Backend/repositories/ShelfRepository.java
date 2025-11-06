package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Rack;
import com.mechanista.wms.Backend.entities.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ShelfRepository extends JpaRepository<Shelf, UUID> {
    Optional<Shelf> findByRackId(Rack rackId);
    Optional<Shelf> findByShelfNumber(int shelfNumber);

    boolean existsById(UUID uuid);
}
