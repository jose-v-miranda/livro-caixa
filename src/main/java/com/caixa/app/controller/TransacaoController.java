package com.caixa.app.controller;

import com.caixa.app.model.Transacao;
import com.caixa.app.repository.TransacaoRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {

    private final TransacaoRepository repository;

    public TransacaoController(TransacaoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Transacao criar(@RequestBody Transacao transacao) {
        if (transacao.getData() == null) {
            transacao.setData(LocalDateTime.now());
        }
        return repository.save(transacao);
    }

    @GetMapping
    public List<Transacao> listar() {
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
