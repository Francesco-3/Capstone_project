package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.PalletDTO;
import com.mechanista.wms.Backend.repositories.PalletRepository;
import com.mechanista.wms.Backend.services.PalletService;
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
@RequestMapping("/pallets")
public class PalletController {
    @Autowired
    private PalletService palletService;

    // POST http://localhost:3001/pallet
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Pallet createPallet(@RequestBody @Validated PalletDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errori nel payload: " + messages);
        }
        return palletService.savePallet(payload);
    }

    // GET http://localhost:3001/pallet
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Pallet> getAllPallets(@PageableDefault(size = 10, direction = Sort.Direction.ASC) Pageable pageable) {
        return palletService.findAll(pageable);
    }

    // GET http://localhost:3001/pallet/{palletId}
    @GetMapping("/{palletId}")
    @ResponseStatus(HttpStatus.OK)
    public Pallet getPalletById(@PathVariable UUID palletId) { return palletService.findById(palletId); }

    // GET http://localhost:3001/pallet/code/{palletCode}
    @GetMapping("/code/{palletCode}")
    @ResponseStatus(HttpStatus.OK)
    public Pallet getPalletByCode(@PathVariable String palletCode) { return palletService.findByPalletCode(palletCode); }

    // PUT http://localhost:3001/pallet/{palletId}
    @PutMapping("/{palletId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Pallet updatePallet(@PathVariable UUID palletId, @Valid @RequestBody PalletDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errori nel payload: " + messages);
        }
        return palletService.findByIdAndUpdate(palletId, payload);
    }

    // DELETE http://localhost:3001/pallet/{palletId}
    @DeleteMapping("/{palletId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public void deletePallet(@PathVariable @NotNull UUID palletId) { palletService.findByIdAndDelete(palletId); }
}
