package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.ProductDTO;
import com.mechanista.wms.Backend.services.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    // POST http://localhost:3001/products
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Product createProduct(@RequestBody @Validated ProductDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return productService.saveProduct(payload);
    }

    // GET http://localhost:3001/products
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Product> getAllProducts(@PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return productService.findAll(pageable);
    }

    // GET http://localhost:3001/products/by-id?product={productId}
    @GetMapping("/by-id")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Product getProductById(@RequestParam("product") UUID productId) { return productService.findById(productId); }

    // GET http://localhost:3001/products/by-name?productName={name}
    @GetMapping("/by-name")
    @ResponseStatus(HttpStatus.OK)
    public Product getProductByName(@RequestParam("productName") String productName) { return productService.findByProductName(productName); }

    // GET http://localhost:3001/products/by-date?insertion={date}
    @GetMapping("/by-date")
    @ResponseStatus(HttpStatus.OK)
    public List<Product> getListByDate(@RequestParam("insertion") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate insertionDate) {
        return productService.findByInsertionDate(insertionDate);
    }

    // GET http://localhost:3001/products/by-price?price={price}
    @GetMapping("/by-price")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public List<Product> getProductByPrice(@RequestParam("price") double price) { return productService.findByPrice(price); }

    // GET http://localhost:3001/products/by-code?productCode={code}
    @GetMapping("/by-code")
    @ResponseStatus(HttpStatus.OK)
    public Product getProductByCode(@RequestParam("productCode") String productCode) { return productService.findByProductCode(productCode); }

    // PUT http://localhost:3001/products/update?product={productId}
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Product updateProduct(@RequestParam("product") UUID productId, @RequestBody @Valid ProductDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return productService.findByIdAndUpdate(productId, payload);
    }

    // DELETE http://localhost:3001/products/delete?product={productId}
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public void deleteProduct(@RequestParam("product") @NotNull UUID productId) { productService.findByIdAndDelete(productId); }

}
