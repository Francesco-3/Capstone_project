package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.Product;
import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.entities.enums.UserRole;
import com.mechanista.wms.Backend.exceptions.BadRequestException;
import com.mechanista.wms.Backend.payloads.ProductDTO;
import com.mechanista.wms.Backend.payloads.UserDTO;
import com.mechanista.wms.Backend.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

    // GET http://localhost:3001/users
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<User> getAllUsers(@PageableDefault(size = 10, direction = Sort.Direction.ASC)Pageable pageable) {
        return userService.findAll(pageable);
    }

    // GET http://localhost:3001/users/me
    @GetMapping("/me")
    public User getProfile(@AuthenticationPrincipal User currentAuthenticateUser) {
        return currentAuthenticateUser;
    }

    // GET http://localhost:3001/users/by-id?user={userId}
    @GetMapping("/by-id")
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public User getUserById(@RequestParam("user") UUID userId) { return userService.findById(userId); };

    // GET http://localhost:3001/users/by-username?username={username}
    @GetMapping("by-username")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public User getUserByUsername(@RequestParam("username") String username) { return userService.findByUsername(username); }

    // GET http://localhost:3001/users/by-role?userRole={userRole}
    @GetMapping("by-role")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public Page<User> getUserByRole(@RequestParam("userRole") UserRole role, @PageableDefault(size = 10, direction = Sort.Direction.ASC) Pageable pageable) { return userService.findByRole(role, pageable); }

    // PUT http://localhost:3001/users/update?user={userId}
    @PutMapping("update")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public User updateUser(@RequestParam("user") UUID userId, @RequestBody @Valid UserDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            String messages = validationResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException("Errori nel payload: " + messages);
        }
        return userService.findByIdAndUpdate(userId, payload);
    }

    // DELETE http://localhost:3001/users/delete?user={userId}
    @DeleteMapping("delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ENGINEER')")
    public void deleteUser(@RequestParam("user") @NotNull UUID userId) { userService.findIdAndDelete(userId); }
}
