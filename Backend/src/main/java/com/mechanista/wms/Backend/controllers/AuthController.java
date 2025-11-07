package com.mechanista.wms.Backend.controllers;

import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.exceptions.ValidationException;
import com.mechanista.wms.Backend.payloads.LoginDTO;
import com.mechanista.wms.Backend.payloads.LoginResponseDTO;
import com.mechanista.wms.Backend.payloads.UserDTO;
import com.mechanista.wms.Backend.services.AuthService;
import com.mechanista.wms.Backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    // POST http://localhost:3001/auth/login
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginDTO payload) {
        return new LoginResponseDTO(authService.checkCredentialsAndGenerateToken(payload));
    }

    // POST http://localhost:3001/auth/signin
    @PostMapping("/signin")
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@RequestBody @Validated UserDTO payload, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors()
                    .stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }
        return userService.saveUser(payload);
    }
}
