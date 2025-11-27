package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Rack;
import com.mechanista.wms.Backend.entities.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShelfRepository extends JpaRepository<Shelf, UUID> {
    Optional<Shelf> findByShelfNumber(int shelfNumber);
    List<Shelf> findByRackId(Rack rackId);


    boolean existsById(UUID uuid);
}
