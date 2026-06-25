package com.nexus.backend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.nexus.backend.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${nexus.jwt.secret}")
    private String secret;

    private static final String ISSUER = "API Nexus";

    public String gerarToken(Usuario usuario) {
        Algorithm algoritmo = Algorithm.HMAC256(secret);

        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(usuario.getEmail())
                .withClaim("perfil", usuario.getTipoUsuarioEnum().name())
                .withExpiresAt(gerarDataExpiracao())
                .sign(algoritmo);
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

    public DecodedJWT validarTokenCompleto(String token) throws JWTVerificationException {
        Algorithm algoritmo = Algorithm.HMAC256(secret);
        return JWT.require(algoritmo)
                .withIssuer(ISSUER)
                .build()
                .verify(token);
    }
}
