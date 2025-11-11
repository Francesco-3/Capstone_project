package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.UserDTO;
import com.mechanista.wms.Backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    // POST http://localhost:3001/users
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public User createUser(@RequestBody @Validated UserDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errori nel payload: " + messages);
        }
        return userService.saveUser(payload);
    }

    // GET http://localhost:3001/users/me
    @GetMapping("/me")
    public User getProfile(@AuthenticationPrincipal User currentAuthenticateUser) {
        return currentAuthenticateUser;
    }

    // GET http://localhost:3001/users/{userId}
    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public User findById(@PathVariable UUID userId) { return userService.findById(userId); };
}
