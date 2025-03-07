function calcularPreco() {
    // Captura dos valores obrigatórios
    const custo = parseFloat(document.getElementById('custo').value);
    const markup = parseFloat(document.getElementById('markup').value);

    // Validação dos campos obrigatórios
    if (isNaN(custo) || isNaN(markup)) {
        alert("⚠️ Por favor, preencha os campos obrigatórios: Custo do Produto e Markup Desejado.");
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
    const sugestaoVenda = custo * markup;
    const deducoesPercentuais = sugestaoVenda * (impostos + taxaCartao + comissaoPlataforma + marketing + comissaoVendedor + outrasDeducoes) / 100;
    const deducoesReais = custoVenda + embalagem + frete + outrosInsumos;
    const totalDeducoes = deducoesPercentuais + deducoesReais;
    const lucroBruto = sugestaoVenda - custo;
    const margemContribuicao = sugestaoVenda - totalDeducoes;

    // Defina uma margem mínima desejada (exemplo: 10%)
    const margemMinimaDesejada = 30; // Em porcentagem

    // Cálculo do preço de venda mínimo para atingir a margem mínima
    const precoMinimo = (custo + totalDeducoes) / (1 - margemMinimaDesejada / 100);

    // Exibição do resultado
    let resultadoHTML = `
        <strong>Sugestão de Venda:</strong> R$ ${sugestaoVenda.toFixed(2)}<br>
        <strong>Lucro Bruto:</strong> R$ ${lucroBruto.toFixed(2)}<br>
        <strong>Total de Deduções/Despesas:</strong> R$ ${totalDeducoes.toFixed(2)}<br>
        <strong>Margem de Contribuição:</strong> R$ ${margemContribuicao.toFixed(2)}<br>
    `;

    // Aviso de preço baixo e sugestão de preço mínimo
    if (margemContribuicao < 0) {
        resultadoHTML += `
            <div class="aviso">
                ⚠️ <strong>Atenção!</strong> O preço de venda está muito baixo e pode resultar em prejuízo.<br>
                Sugerimos aumentar o preço para pelo menos <strong>R$ ${precoMinimo.toFixed(2)}</strong> para garantir uma margem mínima de ${margemMinimaDesejada}%.
            </div>
        `;
    } else if (margemContribuicao / sugestaoVenda * 100 < margemMinimaDesejada) {
        resultadoHTML += `
            <div class="aviso">
                ⚠️ <strong>Atenção!</strong> A margem de contribuição está abaixo do mínimo desejado (${margemMinimaDesejada}%).<br>
                Sugerimos aumentar o preço para pelo menos <strong>R$ ${precoMinimo.toFixed(2)}</strong>.
            </div>
        `;
    }

    // Exibe o resultado
    document.getElementById('resultado').innerHTML = resultadoHTML;
}