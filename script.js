let graficoGastosLucro; // Variável global para o gráfico de gastos e lucro
let graficoDeducoes; // Variável global para o gráfico de deduções

// Função para alternar entre modo escuro e claro
const toggleModo = document.getElementById('toggleModo');
const body = document.body;

toggleModo.addEventListener('click', () => {
    body.classList.toggle('modo-escuro');
});

function calcularPreco() {
    // Captura dos valores obrigatórios
    const custo = parseFloat(document.getElementById('custo').value);
    const precoVenda = parseFloat(document.getElementById('precoVenda').value);

    // Validação dos campos obrigatórios
    if (isNaN(custo) || isNaN(precoVenda)) {
        alert("⚠️ Por favor, preencha os campos obrigatórios: Custo do Produto e Preço de Venda.");
        return; // Interrompe a função se os campos estiverem vazios
    }

    // Captura dos demais valores (opcionais)
    const impostos = parseFloat(document.getElementById('impostos').value) || 0;
    const taxaCartao = parseFloat(document.getElementById('taxaCartao').value) || 0;
    const comissaoPlataforma = parseFloat(document.getElementById('comissaoPlataforma').value) || 0;
    const marketing = parseFloat(document.getElementById('marketing').value) || 0;
    const comissaoVendedor = parseFloat(document.getElementById('comissaoVendedor').value) || 0;
    const outrasDeducoes = parseFloat(document.getElementById('outrasDeducoes').value) || 0;
    const custoVenda = parseFloat(document.getElementById('custoVenda').value) || 0;
    const embalagem = parseFloat(document.getElementById('embalagem').value) || 0;
    const frete = parseFloat(document.getElementById('frete').value) || 0;
    const outrosInsumos = parseFloat(document.getElementById('outrosInsumos').value) || 0;

    // Cálculos
    const deducoesPercentuais = precoVenda * (impostos + taxaCartao + comissaoPlataforma + marketing + comissaoVendedor + outrasDeducoes) / 100;
    const deducoesReais = custoVenda + embalagem + frete + outrosInsumos;
    const totalDeducoes = deducoesPercentuais + deducoesReais;
    const lucroBruto = precoVenda - custo;

    // Margem de Contribuição corrigida
    const margemContribuicao = precoVenda - custo - totalDeducoes;

    // Defina uma margem mínima desejada (exemplo: 10%)
    const margemMinimaDesejada = 40; // Em porcentagem

    // Cálculo do preço de venda mínimo para atingir a margem mínima
    const precoMinimo = (custo + deducoesReais) / (1 - (margemMinimaDesejada / 100 + (impostos + taxaCartao + comissaoPlataforma + marketing + comissaoVendedor + outrasDeducoes) / 100));

    // Exibição do resultado em Cards
    document.getElementById('precoVendaResultado').textContent = `R$ ${precoVenda.toFixed(2)}`;
    document.getElementById('lucroBrutoResultado').textContent = `R$ ${lucroBruto.toFixed(2)}`;
    document.getElementById('deducoesResultado').textContent = `R$ ${totalDeducoes.toFixed(2)}`;
    document.getElementById('margemContribuicaoResultado').textContent = `R$ ${margemContribuicao.toFixed(2)}`;

    // Barra de Progresso
    const progressoMargem = (margemContribuicao / precoVenda) * 100;
    const progressoMinimo = margemMinimaDesejada;

    document.getElementById('progressoMargem').style.width = `${Math.min(progressoMargem, 100)}%`;
    document.getElementById('textoProgresso').textContent = `${Math.min(progressoMargem, 100).toFixed(2)}%`;

    // Dados para o gráfico de gastos e lucro
    const dadosGastosLucro = {
        labels: ['Custo do Produto', 'Deduções Totais', 'Lucro Bruto'],
        datasets: [{
            label: 'Valores em R$',
            data: [custo, totalDeducoes, lucroBruto],
            backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
            borderColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
            borderWidth: 1
        }]
    };

    // Configuração do gráfico de gastos e lucro
    const configGastosLucro = {
        type: 'bar',
        data: dadosGastosLucro,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribuição de Gastos e Lucro'
                }
            }
        }
    };

    // Dados para o gráfico de deduções
    const dadosDeducoes = {
        labels: ['Impostos', 'Taxa de Cartão', 'Comissão Plataforma', 'Marketing', 'Comissão Vendedor', 'Outras Deduções', 'Custo de Venda', 'Embalagem', 'Frete', 'Outros Insumos'],
        datasets: [{
            label: 'Valores em R$',
            data: [
                precoVenda * impostos / 100,
                precoVenda * taxaCartao / 100,
                precoVenda * comissaoPlataforma / 100,
                precoVenda * marketing / 100,
                precoVenda * comissaoVendedor / 100,
                precoVenda * outrasDeducoes / 100,
                custoVenda,
                embalagem,
                frete,
                outrosInsumos
            ],
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
            ],
            borderColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
            ],
            borderWidth: 1
        }]
    };

    // Configuração do gráfico de deduções
    const configDeducoes = {
        type: 'bar',
        data: dadosDeducoes,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Detalhamento das Deduções'
                }
            }
        }
    };

    // Destruir os gráficos anteriores (se existirem)
    if (graficoGastosLucro) {
        graficoGastosLucro.destroy();
    }
    if (graficoDeducoes) {
        graficoDeducoes.destroy();
    }

    // Criar os gráficos
    const ctxGastosLucro = document.getElementById('graficoGastosLucro').getContext('2d');
    graficoGastosLucro = new Chart(ctxGastosLucro, configGastosLucro);

    const ctxDeducoes = document.getElementById('graficoDeducoes').getContext('2d');
    graficoDeducoes = new Chart(ctxDeducoes, configDeducoes);
}
