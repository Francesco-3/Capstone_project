package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Rack;
import com.mechanista.wms.Backend.entities.Section;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.RackDTO;
import com.mechanista.wms.Backend.services.RackService;
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
@RequestMapping("/racks")
public class RackController {
    @Autowired
    private RackService rackService;

    // POST http://localhost:3001/racks
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Rack createRack(@RequestBody @Validated RackDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return rackService.saveRack(payload);
    }

    // GET http://localhost:3001/racks
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Rack> getAllRack(@PageableDefault(size = 10, direction = Sort.Direction.ASC) Pageable pageable) {
        return rackService.findAll(pageable);
    }

    // GET http://localhost:3001/racks/by-id?rack={rackId}
    @GetMapping("/by-id")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Rack getRackById(@RequestParam("rack") UUID rackId) { return rackService.findById(rackId); }

    // GET http://localhost:3001/racks/by-section?sectionCode={sectionCode}
    @GetMapping("/by-section")
    @ResponseStatus(HttpStatus.OK)
    public List<Rack> getRacksBySectionId(@RequestParam("sectionId") Section sectionId) {
        return rackService.findBySectionId(sectionId);
    }

    // GET http://localhost:3001/racks/by-code?rackCode={rackCode}
    @GetMapping("/by-code")
    @ResponseStatus(HttpStatus.OK)
    public Rack getShelfByCode(@RequestParam("rackCode") String rackCode) { return rackService.findByRackCode(rackCode); }

    // PUT http://localhost:3001/racks/update?rack={rackId}
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Rack updateRackById(@RequestParam("rack") UUID rackId, @Valid @RequestBody RackDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errore nel payload: " + messages);
        }

        return rackService.findByIdAndUpdate(rackId, payload);
    }

    // DELETE http://localhost:3001/racks/delete?rack={rackId}
    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public void deleteRack(@RequestParam("rack") @NotNull UUID rackId) { rackService.findByIdAndDelete(rackId); }
}
