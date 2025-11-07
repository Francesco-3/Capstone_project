package com.mechanista.wms.Backend.exceptions;

import lombok.Getter;

import java.util.List;

@Getter
public class ValidationException extends RuntimeException {
    private List<String> errorsMessages;

    public ValidationException(List<String> errorsMessages) {
        super("Ci sono i seguenti errori di validazione:");
        this.errorsMessages = errorsMessages;
    }
}
