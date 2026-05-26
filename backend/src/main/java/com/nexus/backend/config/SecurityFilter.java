package com.nexus.backend.config;

import com.nexus.backend.dao.UsuarioRepository;
import com.nexus.backend.model.Usuario;
import com.nexus.backend.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var token = this.recuperarToken(request);

        if (token != null) {
            var loginEmail = tokenService.validarToken(token);

            if (!loginEmail.isEmpty()) {
                // CORREÇÃO: Usando o usuarioRepository e o método findByEmail
                Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginEmail);

                if (usuarioOpt.isPresent()) {
                    Usuario usuario = usuarioOpt.get();

                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null,
                            Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null)
            return null;
        return authHeader.replace("Bearer ", "");
    }
}