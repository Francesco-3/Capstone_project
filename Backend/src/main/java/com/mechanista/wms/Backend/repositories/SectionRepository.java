package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Section;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SectionRepository extends JpaRepository<Section, UUID> {
    Page<Section> findAll(Pageable pageable);

    Optional<Section> findById(UUID sectionId);
    Optional<Section> findBySectionCode(String sectionCode);
}
