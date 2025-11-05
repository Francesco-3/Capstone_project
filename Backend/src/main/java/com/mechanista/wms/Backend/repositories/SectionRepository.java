package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SectionRepository extends JpaRepository<Section, UUID> {
    Optional<Section> findBySectionCode(String sectionCode);
}
