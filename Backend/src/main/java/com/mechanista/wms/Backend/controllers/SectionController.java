package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Section;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.SectionDTO;
import com.mechanista.wms.Backend.services.SectionService;
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
@RequestMapping("/sections")
public class SectionController {
    @Autowired
    private SectionService sectionService;

    // POST http://localhost:3001/sections
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Section createSection(@RequestBody @Validated SectionDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errori nel payload: " + messages);
        }
        return sectionService.saveSection(payload);
    }

    // GET http://localhost:3001/sections
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<Section> getAllSections(@PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return sectionService.findAll(pageable);
    }

    // GET http://localhost:3001/sections/by-id?section={sectionId}
    @GetMapping("/by-id")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Section getSectionById(@RequestParam("section") UUID sectionId) { return sectionService.findById(sectionId);}

    // GET http://localhost:3001/sections/by-code?sectionCode={sectionCode}
    @GetMapping("/by-code")
    @ResponseStatus(HttpStatus.OK)
    public Section getSectionByCode(@RequestParam("sectionCode") String sectionCode) { return sectionService.findBySectionCode(sectionCode);}

    // PUT http://localhost:3001/sections/update?section={sectionId}
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Section updateSection(@RequestParam("section") UUID sectionId, @Valid @RequestBody SectionDTO payload) {
        return sectionService.findByIdAndUpdate(sectionId, payload);
    }

    // DELETE http://localhost:3001/sections/delete?section={sectionId}
    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSection(@RequestParam("section") @NotNull UUID sectionId) { sectionService.findByIdAndDelete(sectionId); }
}
