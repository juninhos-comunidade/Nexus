package com.nexus.backend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.nexus.backend.model.Usuario;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    private final String secret = "chave-secreta-nexus";

    public String gerarToken(Usuario usuario) {
        Algorithm algoritmo = Algorithm.HMAC256(secret);

        return JWT.create()
                .withIssuer("API Nexus")
                .withSubject(usuario.getEmail())
                .withClaim("perfil", usuario.getTipoUsuario())
                .withExpiresAt(gerarDataExpiracao())
                .sign(algoritmo);
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
