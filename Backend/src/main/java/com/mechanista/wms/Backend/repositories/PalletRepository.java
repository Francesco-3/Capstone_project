package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Rack;
import com.mechanista.wms.Backend.entities.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PalletRepository extends JpaRepository<Pallet, UUID> {
    Optional<Pallet> findByPalletCode(String palletCode);
    List<Pallet> findBySectionId(Section sectionId);

    boolean existsById(UUID uuid);
}
