package com.mechanista.wms.Backend.exceptions;

import com.mechanista.wms.Backend.payloads.ErrorWithListDTO;
import com.mechanista.wms.Backend.payloads.ErrorsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // Logger SLF4J per tracciare errori nel sistema
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Formattatore uniforme per i timestamp dei log
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd - HH:mm:ss");

    // --- VALIDAZIONE (WMS VALIDATOR MODULE) ---
    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorWithListDTO handleValidationErrors(ValidationException ex) {
        log.warn("[INPUT-CHECKER] Errore di validazione multipla: {}", ex.getErrorsMessages());
        return new ErrorWithListDTO("[INPUT-CHECKER] Parametri non conformi alle specifiche", LocalDateTime.now(), ex.getErrorsMessages());
    }

    // --- VALIDAZIONE AUTOMATICA (SPRING @Valid) ---
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorWithListDTO handleInvalidArguments(MethodArgumentNotValidException ex) {
        List<String> errorMessages = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> String.format("%s → %s", err.getField(), err.getDefaultMessage()))
                .collect(Collectors.toList());

        log.warn("[INPUT-CHECKER] Errore di validazione automatica: {}", errorMessages);
        return new ErrorWithListDTO("[INPUT-CHECKER] Errore di validazione nel corpo della richiesta", LocalDateTime.now(), errorMessages);
    }

    // --- BAD REQUEST (400) ---
    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorsDTO handleBadRequest(BadRequestException ex) {
        log.warn("[REQUEST-PARSER] {}", ex.getMessage());
        return buildError("[REQUEST-PARSER] " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // --- NOT FOUND (404) ---
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorsDTO handleNotFound(NotFoundException ex) {
        log.info("[DATA-LINE] {}", ex.getMessage());
        return buildError("[DATA-LINE] " + ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // --- UNAUTHORIZED (401) ---
    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorsDTO handleUnauthorized(UnauthorizedException ex) {
        log.warn("[AUTH-MODULE] Tentativo di accesso non autorizzato: {}", ex.getMessage());
        return buildError("[AUTH-MODULE] " + ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    // --- FORBIDDEN (403) ---
    @ExceptionHandler(AuthorizationDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorsDTO handleForbidden(AuthorizationDeniedException ex) {
        log.warn("[ACCESS-GATE] Accesso negato: {}", ex.getMessage());
        return buildError("[ACCESS-GATE] Accesso negato: permessi insufficienti", HttpStatus.FORBIDDEN);
    }

    // --- ERRORE GENERICO (500) ---
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorsDTO handleGenericError(Exception ex) {
        // estraggo la causa più profonda disponibile
        Throwable cause = ex;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }

        String message = cause.getMessage();
        if (message == null || message.isBlank()) {
            message = "Anomalia interna rilevata [" + ex.getClass().getSimpleName() + "]";
        }

        log.error("[CORE-UNIT] Errore interno: {}", message, ex);
        return buildError("[CORE-UNIT] " + message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // --- COSTRUTTORE DI RISPOSTE STANDARD ---
    private ErrorsDTO buildError(String message, HttpStatus status) {
        String formatted = LocalDateTime.now().format(FORMATTER);
        String fullMessage = String.format("[WMS-SYS %d %s] %s",
                status.value(), status.getReasonPhrase(), message);
        return new ErrorsDTO(fullMessage, LocalDateTime.parse(formatted, FORMATTER));
    }
}
