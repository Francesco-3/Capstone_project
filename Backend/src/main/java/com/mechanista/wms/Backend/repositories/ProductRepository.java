package com.mechanista.wms.Backend.repositories;

import com.mechanista.wms.Backend.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    List<Product> findByInsertionDate(LocalDate insertionDate);

    Optional<Product> findByPrice(double price);
    Optional<Product> findByProductCode(String productCode);
}
