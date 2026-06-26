package com.nexus.backend.controller;

import com.nexus.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/resumo")
    public ResponseEntity<Map<String, Object>> getResumo(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(dashboardService.obterResumo(email));
    }
}