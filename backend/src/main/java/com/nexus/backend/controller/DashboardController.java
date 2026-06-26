package com.nexus.backend.controller;

import com.nexus.backend.model.Usuario;
import com.nexus.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/resumo")
    public ResponseEntity<Map<String, Object>> getResumo(Authentication authentication) {
        String email = null;
        if (authentication != null) {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            email = usuario.getEmail();
        }
        return ResponseEntity.ok(dashboardService.obterResumo(email));
    }
}