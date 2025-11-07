package com.mechanista.wms.Backend.security;

import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.exceptions.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JWTTools {
    @Value("${jwt.secret}")
    private String secret;

    // creo il token
    public String createToken(User user) {
        String roleString = user.getAuthorities().stream()
                // estraggo i nomi dei ruoli e li unisco in una stringa
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .issuedAt(new Date(System.currentTimeMillis())) // data creazione
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // scadenza dopo 7 giorni
                .subject(String.valueOf(user.getId_user()))
                .claim("roles", roleString) // aggiungo il ruolo
                .signWith(Keys.hmacShaKeyFor(secret.getBytes())) // firmo il token
                .compact(); // infine genero la stringa JWT
    }

    // verifico la validità del token
    public void verifyToken(String accessToken) {
        try {
            Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes())).build().parse(accessToken);
        } catch (Exception e) {
            throw new UnauthorizedException("Ci sono stati errori nel token! Effettua un nuovo login!");
        }
    }

    // estraggo l’ID dell’utente contenuto nel subject del token JWT
    public UUID extractIdFromToken(String accessToken) {
        return UUID.fromString(Jwts.parser()

                // verifico la firma del token con la chiave segreta.
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes())).build()

                // estraggo il payload, che contiene tutti i claims
                .parseSignedClaims(accessToken)

                // restituisco l’oggetto Claims
                .getPayload()

                // recupero il valore del campo subject
                .getSubject());
    }

    // estraggo tutti i claims contenuti nel token JWT
    public Claims extractAllClaims(String accessToken) {
        try {
            return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseSignedClaims(accessToken)
                    .getPayload();
        } catch (Exception ex) {
            throw new UnauthorizedException("Problema con l'estrazione dei claims del token: " + ex.getMessage());
        }
    }
}
