let tabelaVisivel = true;
const estadoMes = {};
const estadoDia = {};

let transacoesCache = [];
let transacoesVisiveis = [];
let editandoId = null;
let graficoFinanceiro = null;

document.addEventListener("DOMContentLoaded", () => {
    iniciarContadorDinheiro();
    carregar();

    const busca = document.getElementById("buscaDescricao");
    if (busca) {
        busca.addEventListener("input", filtrarDescricao);
    }
});

// ===============================
// FORMATAÇÃO
// ===============================

function formatarBRL(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

function obterDataValida(transacao) {
    const data = new Date(transacao.data);
    if (isNaN(data.getTime())) {
        return new Date();
    }
    return data;
}

function chaveMes(dataObj) {
    return dataObj.getFullYear() + "-" + String(dataObj.getMonth() + 1).padStart(2, "0");
}

function chaveDia(dataObj) {
    return dataObj.getFullYear() + "-" +
        String(dataObj.getMonth() + 1).padStart(2, "0") + "-" +
        String(dataObj.getDate()).padStart(2, "0");
}

function dataLocalParaFiltro(dataObj) {
    return dataObj.getFullYear() + "-" +
        String(dataObj.getMonth() + 1).padStart(2, "0") + "-" +
        String(dataObj.getDate()).padStart(2, "0");
}

// ===============================
// VISUAL
// ===============================

function toggleTabela() {
    tabelaVisivel = !tabelaVisivel;

    const tabela = document.getElementById("tabelaContainer");
    const btn = document.getElementById("btnTabela");

    tabela.style.display = tabelaVisivel ? "block" : "none";
    btn.innerText = tabelaVisivel ? "Esconder tabela" : "Mostrar tabela";
}

function toggleMes(mesKey) {
    estadoMes[mesKey] = !(estadoMes[mesKey] === true);
    carregar();
}

function toggleDia(diaKey) {
    estadoDia[diaKey] = !(estadoDia[diaKey] === true);
    carregar();
}

// ===============================
// LIMPEZA
// ===============================

function limparCampos() {
    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("data").value = "";
    document.getElementById("observacao").value = "";
    document.getElementById("tipo").value = "ENTRADA";
    document.getElementById("formaPagamento").value = "DINHEIRO";

    editandoId = null;

    limparContadorDinheiro();
    alternarContadorDinheiro();
}

function limparFiltro() {
    document.getElementById("filtroData").value = "";
    document.getElementById("filtroInicio").value = "";
    document.getElementById("filtroFim").value = "";
    document.getElementById("buscaDescricao").value = "";
    carregar();
}

// ===============================
// MENSAGEM
// ===============================

function mostrarMensagem(texto, cor = "green") {
    const msg = document.getElementById("mensagem");
    if (!msg) return;

    msg.style.color = cor;
    msg.innerText = texto;

    setTimeout(() => {
        msg.innerText = "";
    }, 2500);
}

// ===============================
// API
// ===============================

async function buscarTransacoes() {
    const resposta = await fetch("/transacoes");
    return await resposta.json();
}

// ===============================
// CONTADOR DE DINHEIRO
// ===============================

const CAMPOS_DINHEIRO = [
    "nota200",
    "nota100",
    "nota50",
    "nota20",
    "nota10",
    "nota5",
    "nota2",
    "moeda1",
    "moeda050",
    "moeda025",
    "moeda010",
    "moeda005"
];

function iniciarContadorDinheiro() {
    const formaPagamento = document.getElementById("formaPagamento");
    if (formaPagamento) {
        formaPagamento.addEventListener("change", alternarContadorDinheiro);
    }

    CAMPOS_DINHEIRO.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener("input", calcularTotalContado);
        }
    });

    alternarContadorDinheiro();
    calcularTotalContado();
}

function alternarContadorDinheiro() {
    const formaPagamento = document.getElementById("formaPagamento");
    const contador = document.getElementById("contadorDinheiro");

    if (!formaPagamento || !contador) return;

    contador.style.display = formaPagamento.value === "DINHEIRO" ? "block" : "none";
}

function valorCampo(id) {
    const campo = document.getElementById(id);
    if (!campo) return 0;
    return parseInt(campo.value) || 0;
}

function calcularTotalContado() {
    const total =
        valorCampo("nota200") * 200 +
        valorCampo("nota100") * 100 +
        valorCampo("nota50") * 50 +
        valorCampo("nota20") * 20 +
        valorCampo("nota10") * 10 +
        valorCampo("nota5") * 5 +
        valorCampo("nota2") * 2 +
        valorCampo("moeda1") * 1 +
        valorCampo("moeda050") * 0.50 +
        valorCampo("moeda025") * 0.25 +
        valorCampo("moeda010") * 0.10 +
        valorCampo("moeda005") * 0.05;

    const totalContado = document.getElementById("totalContado");
    if (totalContado) {
        totalContado.innerText = formatarBRL(total);
    }

    const valor = document.getElementById("valor");
    const formaPagamento = document.getElementById("formaPagamento");
    if (valor && formaPagamento && formaPagamento.value === "DINHEIRO") {
        valor.value = total.toFixed(2);
    }

    return total;
}

function limparContadorDinheiro() {
    CAMPOS_DINHEIRO.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = 0;
        }
    });

    const total = document.getElementById("totalContado");
    if (total) {
        total.innerText = "R$ 0,00";
    }
}

function obterDadosDinheiro() {
    return {
        nota200: valorCampo("nota200"),
        nota100: valorCampo("nota100"),
        nota50: valorCampo("nota50"),
        nota20: valorCampo("nota20"),
        nota10: valorCampo("nota10"),
        nota5: valorCampo("nota5"),
        nota2: valorCampo("nota2"),
        moeda1: valorCampo("moeda1"),
        moeda050: valorCampo("moeda050"),
        moeda025: valorCampo("moeda025"),
        moeda010: valorCampo("moeda010"),
        moeda005: valorCampo("moeda005")
    };
}

function preencherNotas(transacao) {
    document.getElementById("nota200").value = transacao.nota200 || 0;
    document.getElementById("nota100").value = transacao.nota100 || 0;
    document.getElementById("nota50").value = transacao.nota50 || 0;
    document.getElementById("nota20").value = transacao.nota20 || 0;
    document.getElementById("nota10").value = transacao.nota10 || 0;
    document.getElementById("nota5").value = transacao.nota5 || 0;
    document.getElementById("nota2").value = transacao.nota2 || 0;
    document.getElementById("moeda1").value = transacao.moeda1 || 0;
    document.getElementById("moeda050").value = transacao.moeda050 || 0;
    document.getElementById("moeda025").value = transacao.moeda025 || 0;
    document.getElementById("moeda010").value = transacao.moeda010 || 0;
    document.getElementById("moeda005").value = transacao.moeda005 || 0;

    calcularTotalContado();
}

// ===============================
// CRUD
// ===============================

async function salvar() {
    const descricao = document.getElementById("descricao").value.trim();
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;
    const formaPagamento = document.getElementById("formaPagamento").value;
    const dataInput = document.getElementById("data").value;
    const observacao = document.getElementById("observacao").value.trim();

    if (!descricao) {
        mostrarMensagem("Informe uma descrição.", "red");
        return;
    }

    if (isNaN(valor)) {
        mostrarMensagem("Informe um valor válido.", "red");
        return;
    }

    const transacao = {
        descricao,
        valor,
        tipo,
        formaPagamento,
        data: dataInput || null,
        observacao,
        ...obterDadosDinheiro()
    };

    try {
        const url = editandoId ? `/transacoes/${editandoId}` : "/transacoes";
        const method = editandoId ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transacao)
        });

        if (!resposta.ok) {
            throw new Error("Falha ao salvar");
        }

        mostrarMensagem(editandoId ? "✏️ Transação atualizada!" : "✅ Transação salva!");

        limparCampos();
        carregar();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao salvar.", "red");
    }
}

async function deletar(id) {
    const confirmar = confirm("Deseja realmente excluir?");
    if (!confirmar) return;

    try {
        await fetch(`/transacoes/${id}`, { method: "DELETE" });
        mostrarMensagem("🗑️ Registro removido.");
        carregar();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao excluir.", "red");
    }
}

function editar(id) {
    const transacao = transacoesCache.find(t => t.id === id);
    if (!transacao) return;

    editandoId = id;

    document.getElementById("descricao").value = transacao.descricao || "";
    document.getElementById("valor").value = transacao.valor || "";
    document.getElementById("tipo").value = transacao.tipo || "ENTRADA";
    document.getElementById("formaPagamento").value = transacao.formaPagamento || "DINHEIRO";
    document.getElementById("observacao").value = transacao.observacao || "";

    if (transacao.data) {
        const data = new Date(transacao.data);
        document.getElementById("data").value = data.toISOString().slice(0, 16);
    }

    preencherNotas(transacao);
    alternarContadorDinheiro();

    window.scrollTo({ top: 0, behavior: "smooth" });
    mostrarMensagem("Modo edição ativado.");
}

// ===============================
// MODAL / DETALHES
// ===============================

function garantirModal() {
    if (document.getElementById("modalDetalhes")) return;

    const modal = document.createElement("div");
    modal.id = "modalDetalhes";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.background = "rgba(0,0,0,0.55)";
    modal.style.zIndex = "9999";
    modal.style.padding = "20px";

    modal.innerHTML = `
        <div id="modalDetalhesConteudo" style="
            max-width:650px;
            margin:5vh auto;
            background:#fff;
            border-radius:18px;
            padding:24px;
            box-shadow:0 20px 60px rgba(0,0,0,0.25);
            max-height:90vh;
            overflow:auto;
            position:relative;
        ">
            <button onclick="fecharModal()" style="
                position:absolute;
                top:14px;
                right:14px;
                width:38px;
                height:38px;
                border:none;
                border-radius:50%;
                background:#ef4444;
                color:#fff;
                font-size:18px;
                cursor:pointer;
            ">×</button>

            <h2 style="margin-bottom:16px;">Detalhes da transação</h2>
            <div id="modalDetalhesCorpo"></div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
        if (e.target.id === "modalDetalhes") {
            fecharModal();
        }
    });
}

function abrirModal(conteudoHtml) {
    garantirModal();

    const modal = document.getElementById("modalDetalhes");
    const corpo = document.getElementById("modalDetalhesCorpo");

    if (corpo) corpo.innerHTML = conteudoHtml;
    if (modal) modal.style.display = "block";
}

function fecharModal() {
    const modal = document.getElementById("modalDetalhes");
    if (modal) modal.style.display = "none";
}

function verDetalhes(id) {
    const t = transacoesCache.find(item => item.id === id);
    if (!t) return;

    const data = t.data ? new Date(t.data).toLocaleString("pt-BR") : "-";

    const contagem = [
        t.nota200 ? `${t.nota200} x R$ 200 = ${formatarBRL(t.nota200 * 200)}` : null,
        t.nota100 ? `${t.nota100} x R$ 100 = ${formatarBRL(t.nota100 * 100)}` : null,
        t.nota50 ? `${t.nota50} x R$ 50 = ${formatarBRL(t.nota50 * 50)}` : null,
        t.nota20 ? `${t.nota20} x R$ 20 = ${formatarBRL(t.nota20 * 20)}` : null,
        t.nota10 ? `${t.nota10} x R$ 10 = ${formatarBRL(t.nota10 * 10)}` : null,
        t.nota5 ? `${t.nota5} x R$ 5 = ${formatarBRL(t.nota5 * 5)}` : null,
        t.nota2 ? `${t.nota2} x R$ 2 = ${formatarBRL(t.nota2 * 2)}` : null,
        t.moeda1 ? `${t.moeda1} x R$ 1 = ${formatarBRL(t.moeda1 * 1)}` : null,
        t.moeda050 ? `${t.moeda050} x R$ 0,50 = ${formatarBRL(t.moeda050 * 0.5)}` : null,
        t.moeda025 ? `${t.moeda025} x R$ 0,25 = ${formatarBRL(t.moeda025 * 0.25)}` : null,
        t.moeda010 ? `${t.moeda010} x R$ 0,10 = ${formatarBRL(t.moeda010 * 0.1)}` : null,
        t.moeda005 ? `${t.moeda005} x R$ 0,05 = ${formatarBRL(t.moeda005 * 0.05)}` : null
    ].filter(Boolean);

    abrirModal(`
        <div style="display:grid; gap:12px;">
            <div><strong>Descrição:</strong><br>${t.descricao || "-"}</div>
            <div><strong>Valor:</strong><br>${formatarBRL(Number(t.valor || 0))}</div>
            <div><strong>Tipo:</strong><br>${t.tipo || "-"}</div>
            <div><strong>Pagamento:</strong><br>${t.formaPagamento || "-"}</div>
            <div><strong>Data:</strong><br>${data}</div>
            <div><strong>Observação:</strong><br>${t.observacao || "-"}</div>

            <hr>

            <div>
                <strong>Contagem de dinheiro:</strong><br>
                ${contagem.length ? contagem.map(item => `<div>${item}</div>`).join("") : "<div>-</div>"}
            </div>
        </div>
    `);
}

// ===============================
// BUSCA
// ===============================

function filtrarDescricao() {
    const termo = document.getElementById("buscaDescricao")?.value.toLowerCase() || "";
    const linhas = document.querySelectorAll("#lista tr");

    linhas.forEach(linha => {
        if (linha.classList.contains("mes-header") || linha.classList.contains("dia-header")) {
            linha.style.display = "";
            return;
        }

        const texto = linha.innerText.toLowerCase();
        linha.style.display = texto.includes(termo) ? "" : "none";
    });
}

// ===============================
// RESUMO / DASHBOARD / CAIXA
// ===============================



function atualizarCorResumo(id, valor) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    elemento.classList.remove("positivo", "negativo", "zerado");

    if (valor > 0) {
        elemento.classList.add("positivo");
    } else if (valor < 0) {
        elemento.classList.add("negativo");
    } else {
        elemento.classList.add("zerado");
    }
}

function atualizarDashboard(transacoes) {
    const totalEntradas = transacoes
        .filter(t => t.tipo === "ENTRADA")
        .reduce((acc, t) => acc + Number(t.valor || 0), 0);

    const totalSaidas = transacoes
        .filter(t => t.tipo === "SAIDA")
        .reduce((acc, t) => acc + Number(t.valor || 0), 0);

    const saldo = totalEntradas - totalSaidas;

    const entradasEl = document.getElementById("dashboardEntradas");
    const saidasEl = document.getElementById("dashboardSaidas");
    const saldoEl = document.getElementById("dashboardSaldo");
    const totalEl = document.getElementById("dashboardTotal");

    if (entradasEl) entradasEl.innerText = formatarBRL(totalEntradas);
    if (saidasEl) saidasEl.innerText = formatarBRL(totalSaidas);
    if (saldoEl) saldoEl.innerText = formatarBRL(saldo);
    if (totalEl) totalEl.innerText = String(transacoes.length);
}

function atualizarFechamentoCaixa(transacoes) {
    const dinheiro = transacoes
        .filter(t => t.formaPagamento === "DINHEIRO")
        .reduce((acc, t) => {
            if (t.tipo === "ENTRADA") return acc + Number(t.valor || 0);
            return acc - Number(t.valor || 0);
        }, 0);

    const pix = transacoes
        .filter(t => t.formaPagamento === "PIX")
        .reduce((acc, t) => {
            if (t.tipo === "ENTRADA") return acc + Number(t.valor || 0);
            return acc - Number(t.valor || 0);
        }, 0);

    const sistema = dinheiro + pix;

    const dinheiroEl = document.getElementById("fechamentoDinheiro");
    const pixEl = document.getElementById("fechamentoPix");
    const sistemaEl = document.getElementById("fechamentoSistema");

    if (dinheiroEl) dinheiroEl.innerText = formatarBRL(dinheiro);
    if (pixEl) pixEl.innerText = formatarBRL(pix);
    if (sistemaEl) sistemaEl.innerText = formatarBRL(sistema);
}

function atualizarGraficoFinanceiro(transacoes) {
    const entradas = transacoes
        .filter(t => t.tipo === "ENTRADA")
        .reduce((acc, t) => acc + Number(t.valor || 0), 0);

    const saidas = transacoes
        .filter(t => t.tipo === "SAIDA")
        .reduce((acc, t) => acc + Number(t.valor || 0), 0);

    const saldo = entradas - saidas;

    const canvas = document.getElementById("graficoFinanceiro");
    if (!canvas || typeof Chart === "undefined") return;

    if (graficoFinanceiro) {
        graficoFinanceiro.destroy();
    }

    graficoFinanceiro = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["Entradas", "Saídas", "Saldo"],
            datasets: [{
                label: "Resumo financeiro",
                data: [entradas, saidas, saldo]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ===============================
// EXPORTAÇÃO
// ===============================

function exportarCSV() {
    const dados = transacoesVisiveis.length ? transacoesVisiveis : transacoesCache;

    if (!dados.length) {
        mostrarMensagem("Não há dados para exportar.", "red");
        return;
    }

    const linhas = ["Data;Descricao;Valor;Tipo;Pagamento;Observacao"];

    dados.forEach(t => {
        linhas.push([
            t.data ? new Date(t.data).toLocaleString("pt-BR") : "",
            (t.descricao || "").replaceAll(";", ","),
            Number(t.valor || 0).toFixed(2),
            t.tipo || "",
            t.formaPagamento || "",
            (t.observacao || "").replaceAll(";", ",")
        ].join(";"));
    });

    const blob = new Blob([linhas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "livro-caixa.csv";
    a.click();

    URL.revokeObjectURL(url);
    mostrarMensagem("📄 Arquivo exportado.");
}

function prepararPDF() {
    const dados = transacoesVisiveis.length ? transacoesVisiveis : transacoesCache;

    const janela = window.open("", "_blank");
    if (!janela) {
        mostrarMensagem("Bloqueio de popup impediu a abertura.", "red");
        return;
    }

    const html = `
        <html>
        <head>
            <title>Relatório Livro Caixa</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
                h1 { margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background: #f0f0f0; }
            </style>
        </head>
        <body>
            <h1>Relatório Livro Caixa</h1>
            <p><strong>Gerado em:</strong> ${new Date().toLocaleString("pt-BR")}</p>
            <p><strong>Total de transações:</strong> ${dados.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Pagamento</th>
                    </tr>
                </thead>
                <tbody>
                    ${dados.map(t => `
                        <tr>
                            <td>${t.data ? new Date(t.data).toLocaleString("pt-BR") : ""}</td>
                            <td>${t.descricao || ""}</td>
                            <td>${formatarBRL(Number(t.valor || 0))}</td>
                            <td>${t.tipo || ""}</td>
                            <td>${t.formaPagamento || ""}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
            <script>
                window.onload = () => window.print();
            <\/script>
        </body>
        </html>
    `;

    janela.document.write(html);
    janela.document.close();
}

function calcularDiferencaCaixa(valorContado) {
    const dinheiroSistema = transacoesCache
        .filter(t => t.formaPagamento === "DINHEIRO")
        .reduce((acc, t) => {
            if (t.tipo === "ENTRADA") return acc + Number(t.valor || 0);
            return acc - Number(t.valor || 0);
        }, 0);

    const diferenca = valorContado - dinheiroSistema;

    mostrarMensagem(`Diferença do caixa: ${formatarBRL(diferenca)}`);

    return { dinheiroSistema, diferenca };
}

// ===============================
// CARREGAR
// ===============================

async function carregar() {
    const resposta = await fetch("/transacoes");
    const dados = await resposta.json();

    transacoesCache = dados;

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    let totalDinheiro = 0;
    let totalPix = 0;

    const filtroData = document.getElementById("filtroData")?.value || "";
    const filtroInicio = document.getElementById("filtroInicio")?.value || "";
    const filtroFim = document.getElementById("filtroFim")?.value || "";

    const filtradas = dados.filter(t => {
        const data = obterDataValida(t);
        const dataTexto = dataLocalParaFiltro(data);

        if (filtroData && dataTexto !== filtroData) return false;
        if (filtroInicio && data < new Date(filtroInicio)) return false;
        if (filtroFim && data > new Date(filtroFim + "T23:59")) return false;

        return true;
    });

    transacoesVisiveis = filtradas;

    filtradas.sort((a, b) => obterDataValida(b).getTime() - obterDataValida(a).getTime());

    const grupos = {};

    filtradas.forEach(t => {
        const data = obterDataValida(t);
        const mes = chaveMes(data);
        const dia = chaveDia(data);

        if (!grupos[mes]) {
            grupos[mes] = {};
        }

        if (!grupos[mes][dia]) {
            grupos[mes][dia] = [];
        }

        grupos[mes][dia].push(t);
    });

    const meses = Object.keys(grupos).sort().reverse();

    if (meses.length === 0) {
        lista.innerHTML = `
            <tr>
                <td colspan="6">Nenhuma transação encontrada.</td>
            </tr>
        `;
        atualizarResumo(0, 0);
        atualizarDashboard([]);
        atualizarFechamentoCaixa([]);
        atualizarGraficoFinanceiro([]);
        return;
    }

    meses.forEach(mesKey => {
        const [ano, mes] = mesKey.split("-");
        const nomeMes = new Date(Number(ano), Number(mes) - 1).toLocaleString("pt-BR", { month: "long" });

        const abertoMes = estadoMes[mesKey] === true;

        const linhaMes = document.createElement("tr");
        linhaMes.className = "mes-header";
        linhaMes.innerHTML = `
            <td colspan="6">📅 ${nomeMes.toUpperCase()} ${ano} ${abertoMes ? "▼" : "▶"}</td>
        `;
        linhaMes.onclick = () => toggleMes(mesKey);
        lista.appendChild(linhaMes);

        const dias = Object.keys(grupos[mesKey]).sort().reverse();

        dias.forEach(diaKey => {
            const abertoDia = estadoDia[diaKey] === true;
            const [a, m, d] = diaKey.split("-");
            const dataDia = new Date(a, m - 1, d);

            const linhaDia = document.createElement("tr");
            linhaDia.className = "dia-header";
            linhaDia.style.display = abertoMes ? "" : "none";
            linhaDia.innerHTML = `
                <td colspan="6">📆 ${dataDia.toLocaleDateString("pt-BR")} ${abertoDia ? "▼" : "▶"}</td>
            `;
            linhaDia.onclick = () => toggleDia(diaKey);
            lista.appendChild(linhaDia);

            grupos[mesKey][diaKey].forEach(t => {
                const valor = Number(t.valor);

                if (t.tipo === "ENTRADA") {
                    if (t.formaPagamento === "DINHEIRO") {
                        totalDinheiro += valor;
                    } else {
                        totalPix += valor;
                    }
                } else {
                    if (t.formaPagamento === "DINHEIRO") {
                        totalDinheiro -= valor;
                    } else {
                        totalPix -= valor;
                    }
                }

                const linha = document.createElement("tr");
                linha.style.display = abertoMes && abertoDia ? "" : "none";
                linha.innerHTML = `
                    <td>${obterDataValida(t).toLocaleString("pt-BR")}</td>
                    <td>${t.descricao || ""}</td>
                    <td class="${t.tipo === "ENTRADA" ? "entrada" : "saida"}">${formatarBRL(valor)}</td>
                    <td>${t.tipo || ""}</td>
                    <td>${t.formaPagamento || ""}</td>
                    <td>
                        <button onclick="verDetalhes(${t.id})">👁</button>
                        <button onclick="editar(${t.id})">✏️</button>
                        <button onclick="deletar(${t.id})">🗑️</button>
                    </td>
                `;
                lista.appendChild(linha);
            });
        });
    });

    atualizarDashboard(filtradas);
    atualizarFechamentoCaixa(filtradas);
    atualizarGraficoFinanceiro(filtradas);

    if (document.getElementById("buscaDescricao")?.value) {
        filtrarDescricao();
    }
}

// ===============================
// TECLAS
// ===============================

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        fecharModal();
    }
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        salvar();
    }
});

// ===============================
// LOG
// ===============================

console.log("Livro Caixa carregado.");