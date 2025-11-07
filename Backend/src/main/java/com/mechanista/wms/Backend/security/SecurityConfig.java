package com.mechanista.wms.Backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JWTFilter jwtFilter;

    // Configurazione principale della sicurezza
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity security) throws Exception {
        // disabilitazioni standard
        security.formLogin(login -> login.disable());
        security.csrf(csrf -> csrf.disable());
        security.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // aggiungo il filtro JWT alla catena di sicurezza
        security.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // regole di autorizzazione
        security.authorizeHttpRequests(request ->{
            request.requestMatchers("/auth/**").permitAll(); // endpoint pubblici
            request.requestMatchers("/**").authenticated(); // endpoint con token
        });

        // Abilita le regole CORS definite nel bean
        security.cors(Customizer.withDefaults());
        return security.build();
    }

    @Bean
    public static PasswordEncoder getBCrypt() {
        return new BCryptPasswordEncoder(12); // numero alto = più forte = più lento
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "http://127.0.0.1:*")); // permetto richieste da localhost e 127.0.0.1 (qualsiasi porta)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // metodi http consentiti
        configuration.setAllowedHeaders(List.of("*")); // permetto tutti gli header
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // applico la config a ogni endpoint
        return source;
    }
}
