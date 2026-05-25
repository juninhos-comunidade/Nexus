package com.nexus.backend.controller;

import com.nexus.backend.dao.FornecedorRepository;
import com.nexus.backend.dao.UsuarioRepository;
import com.nexus.backend.dto.CadastroRequestDTO;
import com.nexus.backend.dto.LoginRequestDTO;
import com.nexus.backend.model.Fornecedor;
import com.nexus.backend.model.Usuario;
import com.nexus.backend.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public String realizarCadastro(@RequestBody CadastroRequestDTO dados) {
        try {
            if (usuarioRepository.findByEmail(dados.email()).isPresent()) {
                return "Erro: Este e-mail já está em uso.";
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
                    return "Erro: Este CNPJ já está cadastrado.";
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

            return "Cadastro realizado com sucesso!";

        } catch (Exception e) {
            return "Erro ao realizar cadastro: " + e.getMessage();
        }
    }

    @PostMapping("/login")
    public String realizarLogin(@RequestBody LoginRequestDTO dados) {

        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByEmail(dados.email());

        if (usuarioEncontrado.isPresent() && usuarioEncontrado.get().getSenha().equals(dados.senha())) {
            Usuario usuarioLogado = usuarioEncontrado.get();

            String tokenJwt = tokenService.gerarToken(usuarioLogado);

            System.out.println("Login efetuado e Token gerado para: " + usuarioLogado.getEmail());

            return "Bearer " + tokenJwt;
        }

        System.out.println("Tentativa de login falhou para: " + dados.email());
        return "Erro: E-mail ou senha incorretos.";
    }
}