package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.*;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.MovementDTO;
import com.mechanista.wms.Backend.services.MovementService;
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

import java.time.LocalDate;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/movements")
public class MovementeController {
    @Autowired
    private MovementService movementService;

    // POST http://localhost:3001/movements
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_MECHANICAL')")
    public Movement createMovement(@RequestBody @Validated MovementDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return movementService.saveMovement(payload);
    }

    // GET http://localhost:3001/movements
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Page<Movement> getAllMovement(@PageableDefault(size = 10, direction = Sort.Direction.ASC) Pageable pageable) {
        return movementService.findAll(pageable);
    } // pulire il json

    // GET http://localhost:3001/movements/by-id?movement={movementId}
    @GetMapping("/by-id")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Movement getMovementById(@RequestParam("movement") UUID movementId) { return movementService.findById(movementId); }

    // GET http://localhost:3001/movements/by-product?product={productId}
    @GetMapping("/by-product")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Page<Movement> getProductById(@RequestParam("product") Product productId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return movementService.findByProductId(productId, pageable);
    }

    // GET http://localhost:3001/movements/by-date?movementDate={date}
    @GetMapping("/by-date")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Page<Movement> getPalletById(@RequestParam("movementDate") LocalDate date, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return movementService.findByDate(date, pageable);
    }

    // GET http://localhost:3001/movements/by-user?user={userId}
    @GetMapping("/by-user")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Page<Movement> getByUserId(@RequestParam("user") UUID userId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return movementService.findByUserId(userId, pageable);
    }

    // PUT http://localhost:3001/movements/update?movement={movementId}
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_MECHANICAL')")
    public Movement updateMovement(@RequestParam("movement") UUID movementId, @RequestBody @Valid MovementDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return movementService.findByIdAndUpdate(movementId, payload);
    }

    // DELETE http://localhost:3001/movements/delete?movement={movementId}
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_MECHANICAL')")
    public void deleteMovement(@RequestParam("movement") @NotNull UUID movementId) { movementService.findByIdAndDelete(movementId); }
}
