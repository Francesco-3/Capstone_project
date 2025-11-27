package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Collocation;
import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.entities.Shelf;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.CollocationDTO;
import com.mechanista.wms.Backend.payloads.ProductOnShelfDTO;
import com.mechanista.wms.Backend.services.CollocationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/collocations")
public class CollocationController {
    @Autowired
    private CollocationService collocationService;

    // POST http://localhost:3001/collocations
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Collocation createCollocation(@RequestBody @Validated CollocationDTO payload, BindingResult validationResult) {
        if(validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return collocationService.saveCollocation(payload);
    }

    // GET http://localhost:3001/collocations
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Collocation> getAllCollocation(@PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return collocationService.findAll(pageable);
    } // pulire il json

    // GET http://localhost:3001/collocations/by-id?collocation={collocationId}
    @GetMapping("/by-id")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Collocation getCollocationById(@RequestParam("collocation") UUID collocationId) { return collocationService.findById(collocationId); }

    // GET http://localhost:3001/collocations/by-product?product={productId}
    @GetMapping("/by-product")
    @ResponseStatus(HttpStatus.OK)
    public Page<Collocation> getProductById(@RequestParam("product") Product productId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return collocationService.findByProductId(productId, pageable);
    }

    // GET http://localhost:3001/collocations/by-pallet?pallet={palletId}
    @GetMapping("/by-pallet")
    @ResponseStatus(HttpStatus.OK)
    public Page<Collocation> getPalletById(@RequestParam("pallet") Pallet palletId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return collocationService.findByPalletId(palletId, pageable);
    }

    // GET http://localhost:3001/collocations/by-shelf?shelf={shelfId}
    @GetMapping("/by-shelf")
    @ResponseStatus(HttpStatus.OK)
    public Page<Collocation> getShelfById(@RequestParam("shelf") Shelf shelfId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return collocationService.findByShelfId(shelfId, pageable);
    }

    // PUT http://localhost:3001/collocations/update?collocation={collocationId}
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Collocation updateCollocation(@RequestParam("collocation") UUID collocationId, @RequestBody @Valid CollocationDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return collocationService.findByIdAndUpdate(collocationId, payload);
    }

    // DELETE http://localhost:3001/collocations/delete?collocation={collocationId}
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public void deleteCollocation(@RequestParam("collocation") @NotNull UUID collocationId) { collocationService.findByIdAndDelete(collocationId); }
}
