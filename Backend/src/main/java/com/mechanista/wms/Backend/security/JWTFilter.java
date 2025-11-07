package com.mechanista.wms.Backend.security;

import com.mechanista.wms.Backend.entities.User;
import com.mechanista.wms.Backend.exceptions.UnauthorizedException;
import com.mechanista.wms.Backend.services.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JWTFilter extends OncePerRequestFilter {
    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Inserire il token nell'authorization header nel formato corretto!");
        }

        String accessToken = authHeader.replace("Bearer ", "");
        jwtTools.verifyToken(accessToken);

        Claims claims = jwtTools.extractAllClaims(accessToken); // estraggo i claims
        UUID userId = UUID.fromString(claims.getSubject()); // recupero l'id utente
        User found = userService.findById(userId); // Cerco l'utente nel databas
        String roleString = claims.get("roles", String.class); // estraggp la lista dei ruoli
        List<SimpleGrantedAuthority> authorities = null;

        // se esistono ruoli, li trasformo in oggetti GrantedAuthority
        if (roleString != null) {
            authorities = Arrays.stream(roleString.split(","))
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(found, null, authorities); // creo un oggetto Authentication con utente e ruoli
        SecurityContextHolder.getContext().setAuthentication(authentication); // Imposta l’autenticazione nel contesto di sicurezza di Spring
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return new AntPathMatcher().match("/auth/**", request.getServletPath()); // evito di filtrare le richieste verso /auth/**
    }
}
