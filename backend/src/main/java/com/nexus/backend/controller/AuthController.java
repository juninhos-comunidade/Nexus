package com.nexus.backend.controller;

import com.nexus.backend.repository.FornecedorRepository;
import com.nexus.backend.dto.CadastroRequestDTO;
import com.nexus.backend.dto.LoginRequestDTO;
import com.nexus.backend.model.Fornecedor;
import com.nexus.backend.model.Usuario;
import com.nexus.backend.repository.UsuarioRepository;
import com.nexus.backend.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/cadastro")
    public ResponseEntity<?> realizarCadastro(@RequestBody CadastroRequestDTO dados) {
        try {
            if (usuarioRepository.findByEmail(dados.email()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("erro", "Este e-mail já está em uso."));
            }

            Usuario novoUsuario = new Usuario(
                    dados.nome(),
                    dados.email(),
                    dados.senha(),
                    dados.tipoUsuario(),
                    dados.nomeNegocio(),
                    dados.telefone());

            usuarioRepository.save(novoUsuario);

            if (dados.tipoUsuario().equalsIgnoreCase("FORNECEDOR")) {

                if (fornecedorRepository.findByCnpj(dados.cnpj()).isPresent()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("erro", "Este CNPJ já está cadastrado."));
                }

                Fornecedor perfilFornecedor = new Fornecedor(
                        dados.nomeNegocio(),
                        dados.cnpj(),
                        dados.email(),
                        dados.telefone(),
                        dados.categoria(),
                        dados.descricao());

                fornecedorRepository.save(perfilFornecedor);
            }

            return ResponseEntity.ok(Map.of("mensagem", "Cadastro realizado com sucesso!"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao realizar cadastro: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> realizarLogin(@RequestBody LoginRequestDTO dados) {

        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByEmail(dados.email());

        if (usuarioEncontrado.isPresent() && usuarioEncontrado.get().getSenha().equals(dados.senha())) {
            Usuario usuarioLogado = usuarioEncontrado.get();

            String tokenJwt = tokenService.gerarToken(usuarioLogado);

            System.out.println("Login efetuado e Token gerado para: " + usuarioLogado.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", "Bearer " + tokenJwt);

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("nome", usuarioLogado.getNome());
            userMap.put("email", usuarioLogado.getEmail());
            userMap.put("nomeNegocio", usuarioLogado.getNomeNegocio());
            userMap.put("telefone", usuarioLogado.getTelefone());
            userMap.put("perfil", usuarioLogado.getTipoUsuario()); // Assumindo que o método getTipoUsuario() exista na
                                                                   // sua classe Usuario
            response.put("usuario", userMap);

            return ResponseEntity.ok(response);
        }

        System.out.println("Tentativa de login falhou para: " + dados.email());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "E-mail ou senha incorretos."));
    }
}