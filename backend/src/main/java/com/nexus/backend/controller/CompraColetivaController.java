package com.nexus.backend.controller;

import com.nexus.backend.model.CompraColetiva;
import com.nexus.backend.repository.CompraColetivaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras-coletivas")
public class CompraColetivaController {

    @Autowired
    private CompraColetivaRepository repository;

    @GetMapping
    public ResponseEntity<List<CompraColetiva>> listarAtivas() {
        return ResponseEntity.ok(repository.findAll());
    }
}