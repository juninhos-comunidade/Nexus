package com.nexus.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping
    public String acessarPainel() {
        return "Acesso liberado. Bem-vindo ao painel da Nexus.";
    }
}
