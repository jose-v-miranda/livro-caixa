package com.caixa.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    private Double valor;

    @Enumerated(EnumType.STRING)
    private TipoTransacao tipo;

    @Enumerated(EnumType.STRING)
    private FormaPagamento formaPagamento;

    private LocalDateTime data;

    // NOVOS CAMPOS

    @Column(length = 1000)
    private String observacao;

    private Integer nota200 = 0;
    private Integer nota100 = 0;
    private Integer nota50 = 0;
    private Integer nota20 = 0;
    private Integer nota10 = 0;
    private Integer nota5 = 0;
    private Integer nota2 = 0;

    private Integer moeda1 = 0;
    private Integer moeda050 = 0;
    private Integer moeda025 = 0;
    private Integer moeda010 = 0;
    private Integer moeda005 = 0;

    // GETTERS E SETTERS

    public Long getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public TipoTransacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoTransacao tipo) {
        this.tipo = tipo;
    }

    public FormaPagamento getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(FormaPagamento formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Integer getNota200() {
        return nota200;
    }

    public void setNota200(Integer nota200) {
        this.nota200 = nota200;
    }

    public Integer getNota100() {
        return nota100;
    }

    public void setNota100(Integer nota100) {
        this.nota100 = nota100;
    }

    public Integer getNota50() {
        return nota50;
    }

    public void setNota50(Integer nota50) {
        this.nota50 = nota50;
    }

    public Integer getNota20() {
        return nota20;
    }

    public void setNota20(Integer nota20) {
        this.nota20 = nota20;
    }

    public Integer getNota10() {
        return nota10;
    }

    public void setNota10(Integer nota10) {
        this.nota10 = nota10;
    }

    public Integer getNota5() {
        return nota5;
    }

    public void setNota5(Integer nota5) {
        this.nota5 = nota5;
    }

    public Integer getNota2() {
        return nota2;
    }

    public void setNota2(Integer nota2) {
        this.nota2 = nota2;
    }

    public Integer getMoeda1() {
        return moeda1;
    }

    public void setMoeda1(Integer moeda1) {
        this.moeda1 = moeda1;
    }

    public Integer getMoeda050() {
        return moeda050;
    }

    public void setMoeda050(Integer moeda050) {
        this.moeda050 = moeda050;
    }

    public Integer getMoeda025() {
        return moeda025;
    }

    public void setMoeda025(Integer moeda025) {
        this.moeda025 = moeda025;
    }

    public Integer getMoeda010() {
        return moeda010;
    }

    public void setMoeda010(Integer moeda010) {
        this.moeda010 = moeda010;
    }

    public Integer getMoeda005() {
        return moeda005;
    }

    public void setMoeda005(Integer moeda005) {
        this.moeda005 = moeda005;
    }

    public void setId(Long id) {
        this.id = id;
    }
}