package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Rack;
import com.mechanista.wms.Backend.entities.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RackRepository extends JpaRepository<Rack, UUID> {
    Optional<Rack> findByShelfCode(String shelfCode);
    Optional<Rack> findBySectionId(Section sectionId);
}
