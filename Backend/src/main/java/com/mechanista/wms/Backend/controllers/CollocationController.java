package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Collocation;
import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.entities.Shelf;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.CollocationDTO;
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

import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/collocations")
public class CollocationController {
    @Autowired
    private CollocationService collocationService;

    // http://localhost:3001/collocations
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

    // http://localhost:3001/collocations
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Collocation> getAllCollocation(@PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return collocationService.findAll(pageable);
    } // pulire il json

    // http://localhost:3001/collocations/collocation={collocationId}
    @GetMapping("/collocation={collocationId}")
    @ResponseStatus(HttpStatus.OK)
    public Collocation getCollocationById(@PathVariable UUID collocationId) { return collocationService.findById(collocationId); }

    // http://localhost:3001/collocations/collocation?product={productId}
    @GetMapping("/collocation?product={productId}")
    @ResponseStatus(HttpStatus.OK)
    public Page<Collocation> getProductById(@PathVariable Product productId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return collocationService.findByProductId(productId, pageable);
    }

    // http://localhost:3001/collocations/collocation?pallet={palletId}
    @GetMapping("/collocation?pallet={palletId}")
    @ResponseStatus(HttpStatus.OK)
    public Page<Collocation> getPalletById(@PathVariable Pallet palletId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return collocationService.findByPalletId(palletId, pageable);
    }

    // http://localhost:3001/collocations/collocation?shelf={shelfId}
    @GetMapping("/collocation?shelf={shelfId}")
    @ResponseStatus(HttpStatus.OK)
    public Page<Collocation> getShelfById(@PathVariable Shelf shelfId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return collocationService.findByShelfId(shelfId, pageable);
    }

    // http://localhost:3001/collocations/update?collocation={collocationId}
    @PutMapping("/update?collocation={collocationId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Collocation updateCollocation(@PathVariable UUID collocationId, @RequestBody @Valid CollocationDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return collocationService.findByIdAndUpdate(collocationId, payload);
    }

    // http://localhost:3001/collocations/delete?collocation={collocationId}
    @DeleteMapping("/delete?collocation={collocationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public void deleteCollocation(@PathVariable @NotNull UUID collocationId) { collocationService.findByIdAndDelete(collocationId); }
}
