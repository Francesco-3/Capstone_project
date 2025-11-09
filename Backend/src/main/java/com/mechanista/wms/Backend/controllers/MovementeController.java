package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.*;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.CollocationDTO;
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
    public Page<Movement> getAllMovement(@PageableDefault(size = 10, direction = Sort.Direction.ASC) Pageable pageable) {
        return movementService.findAll(pageable);
    } // pulire il json

    // GET http://localhost:3001/movements/movement={movementId}
    @GetMapping("/movement={movementId}")
    @ResponseStatus(HttpStatus.OK)
    public Movement getMovementById(@PathVariable UUID movementId) { return movementService.findById(movementId); }

    // GET http://localhost:3001/movements/movement?product={productId}
    @GetMapping("/product?movement={productId}")
    @ResponseStatus(HttpStatus.OK)
    public Page<Movement> getProductById(@PathVariable Product productId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return movementService.findByProductId(productId, pageable);
    }

    // GET http://localhost:3001/movements/movement?date={date}
    @GetMapping("/movement?date={date}")
    @ResponseStatus(HttpStatus.OK)
    public Page<Movement> getPalletById(@PathVariable LocalDate date, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return movementService.findByDate(date, pageable);
    }

    // http://localhost:3001/movements/movement?user={userId}
    @GetMapping("/user?movement={userId}")
    @ResponseStatus(HttpStatus.OK)
    public Page<Movement> getByUserId(@PathVariable UUID userId, @PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return movementService.findByUserId(userId, pageable);
    }

    // http://localhost:3001/movements/update?movement={movementId}
    @PutMapping("/update?movement={movementId}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_MECHANICAL')")
    public Movement updateMovement(@PathVariable UUID movementId, @RequestBody @Valid MovementDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return movementService.findByIdAndUpdate(movementId, payload);
    }

    // http://localhost:3001/movements/delete?movement={movementId}
    @DeleteMapping("/delete?movement={movementId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_MECHANICAL')")
    public void deleteMovement(@PathVariable @NotNull UUID movementId) { movementService.findByIdAndDelete(movementId); }
}
