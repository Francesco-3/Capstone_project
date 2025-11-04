package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SectionRepository extends JpaRepository<Section, UUID> {
    List<Section> findBySectionCode(String sectionCode);
}
