package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Shelf;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.ShelfDTO;
import com.mechanista.wms.Backend.services.ShelfService;
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
@RequestMapping("/shelfs")
public class ShelfController {
    @Autowired
    private ShelfService shelfService;

    // POST http://localhost:3001/shelfs
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Shelf createShelf(@RequestBody @Validated ShelfDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return shelfService.saveShelf(payload);
    }

    // GET http://localhost:3001/shelfs
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Shelf> getAllShelf(@PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return shelfService.findAll(pageable);
    }

    //GET http://localhost:3001/shelfs/{shelfId}
    @GetMapping("/{shelfId}")
    @ResponseStatus(HttpStatus.OK)
    public Shelf getShelfById(@PathVariable UUID shelfId) { return shelfService.findById(shelfId); }

    // PUT http://localhost:3001/shelf/{shelfId}
    @PutMapping("/{shelfId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Shelf updateShelf(@PathVariable UUID shelfId, @Valid @RequestBody ShelfDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return shelfService.findByIdAndUpdate(shelfId, payload);
    }

    // DELETE http://localhost:3001/shelfs/{shelfId}
    @DeleteMapping("/{shelfId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public void deleteShelf(@PathVariable @NotNull UUID shelfId) { shelfService.findByIdAndDelete(shelfId); }
}
