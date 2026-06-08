package com.example.be.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt đúng loại exception bạn đã ném ra ở Service
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        // Trả về HTTP Status 400 (Bad Request) kèm theo message "Email already exists"
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}

