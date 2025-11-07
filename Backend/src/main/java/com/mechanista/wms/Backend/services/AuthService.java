package com.mechanista.wms.Backend.services;

import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.exceptions.UnauthorizedException;
import com.mechanista.wms.Backend.payloads.LoginDTO;
import com.mechanista.wms.Backend.security.JWTTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserService userService;

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private PasswordEncoder bcrypt;

    public String checkCredentialsAndGenerateToken(LoginDTO payload) {
        User found = this.userService.findByEmail(payload.email());

        if (bcrypt.matches(payload.password(), found.getPassword())) {
            return jwtTools.createToken(found);
        } else {
            throw new UnauthorizedException("Credenziali errate!");
        }
    }
}
