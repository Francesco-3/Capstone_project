package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Pallet;
import com.mechanista.wms.Backend.entities.Rack;
import com.mechanista.wms.Backend.entities.Section;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.PalletDTO;
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

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pallets")
public class PalletController {
    @Autowired
    private PalletService palletService;

    // POST http://localhost:3001/pallets
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

    // GET http://localhost:3001/pallets
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Pallet> getAllPallets(@PageableDefault(size = 10, direction = Sort.Direction.ASC) Pageable pageable) {
        return palletService.findAll(pageable);
    }

    // GET http://localhost:3001/pallets/by-id?pallet={palletId}
    @GetMapping("/by-id")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Pallet getPalletById(@RequestParam("pallet") UUID palletId) { return palletService.findById(palletId); }

    // GET http://localhost:3001/pallets/by-code?palletCode={palletCode}
    @GetMapping("/by-code")
    @ResponseStatus(HttpStatus.OK)
    public Pallet getPalletByCode(@RequestParam("palletCode") String palletCode) { return palletService.findByPalletCode(palletCode); }

    // GET http://localhost:3001/pallets/by-section?sectionId={sectionId}
    @GetMapping("/by-section")
    @ResponseStatus(HttpStatus.OK)
    public List<Pallet> getPalletBySectionId(@RequestParam("sectionId") Section sectionId) {
        return palletService.findBySectionId(sectionId);
    }

    // PUT http://localhost:3001/pallets/update?pallet={palletId}
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Pallet updatePallet(@RequestParam("pallet") UUID palletId, @Valid @RequestBody PalletDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errori nel payload: " + messages);
        }
        return palletService.findByIdAndUpdate(palletId, payload);
    }

    // DELETE http://localhost:3001/pallets/delete?pallet={palletId}
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public void deletePallet(@RequestParam("pallet") @NotNull UUID palletId) { palletService.findByIdAndDelete(palletId); }
}
