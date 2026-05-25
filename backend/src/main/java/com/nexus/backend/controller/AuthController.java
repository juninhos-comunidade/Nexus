package com.nexus.backend.controller;

import com.nexus.backend.dao.FornecedorDAO;
import com.nexus.backend.dao.UsuarioDAO;
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
    private UsuarioDAO usuarioDAO;

    @Autowired
    private FornecedorDAO fornecedorDAO;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/cadastro")
    public String realizarCadastro(@RequestBody CadastroRequestDTO dados) {
        try {
            Usuario novoUsuario = new Usuario(
                    dados.nome(),
                    dados.email(),
                    dados.senha(),
                    dados.tipoUsuario(),
                    dados.nomeNegocio(),
                    dados.telefone());

            usuarioDAO.salvar(novoUsuario);

            if (dados.tipoUsuario().equalsIgnoreCase("FORNECEDOR")) {
                Fornecedor perfilFornecedor = new Fornecedor(
                        dados.nomeNegocio(),
                        dados.cnpj(),
                        dados.email(),
                        dados.telefone(),
                        dados.categoria(),
                        dados.descricao());

                fornecedorDAO.salvar(perfilFornecedor);
            }

            return "Cadastro realizado com sucesso!";

        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
    }

    @PostMapping("/login")
    public String realizarLogin(@RequestBody LoginRequestDTO dados) {

        Optional<Usuario> usuarioEncontrado = usuarioDAO.buscarPorEmailESenha(dados.email(), dados.senha());

        if (usuarioEncontrado.isPresent()) {
            Usuario usuarioLogado = usuarioEncontrado.get();

            String tokenJwt = tokenService.gerarToken(usuarioLogado);

            System.out.println("Login efetuado e Token gerado para: " + usuarioLogado.getEmail());

            return "Bearer " + tokenJwt;
        }

        System.out.println("Tentativa de login falhou para: " + dados.email());
        return "Erro: E-mail ou senha incorretos.";
    }
}