package com.nexus.backend.repository;

import com.nexus.backend.model.Participacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ParticipacaoRepository extends JpaRepository<Participacao, Long> {
    List<Participacao> findByUsuarioEmailOrderByDataParticipacaoDesc(String email);
}