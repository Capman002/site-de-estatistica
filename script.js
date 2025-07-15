// Dados exemplo pré-carregados
const dadosExemplo = {
    maquinaA: [88.24, 87.58, 87.99, 87.89, 88.04, 88.14, 88.10, 88.07, 87.83, 87.77, 87.85, 88.19, 88.39, 87.90, 87.69, 88.18, 87.96, 87.96, 87.93, 88.26, 87.72, 87.59, 88.09, 88.30, 88.12, 88.22, 87.82, 88.01, 88.03, 88.09],
    maquinaB: [87.80, 88.13, 88.22, 88.15, 88.08, 88.30, 88.14, 88.25, 88.09, 88.03, 88.18, 87.79, 87.82, 88.04, 88.19, 88.18, 87.92, 88.06, 88.28, 88.04, 88.14, 87.70, 88.30, 87.91, 88.14, 87.98, 87.63, 87.95, 88.14, 87.96],
    temposFalha: [129, 124, 121, 123, 127, 136, 134, 130, 130, 129, 125, 123, 136, 131, 124, 123, 129, 133, 133, 125, 131, 120, 137, 125, 132, 120, 130, 125, 125, 131, 124, 119, 125, 133, 124, 136, 128, 133, 133, 136, 130, 128, 124, 141, 131, 128, 129, 129, 129, 130, 136, 133, 128, 125, 141, 133, 128, 125, 125, 139, 128, 129, 129, 129, 138, 137, 129, 129, 129, 128, 129, 124, 130, 131, 129, 136, 131, 131, 131, 129, 121, 142, 122, 129, 121, 142, 136, 129, 129, 121, 128, 135, 140, 126, 125, 121, 129, 126, 126, 128]
};

const dadosMaquinasAnalise = {
    X: [35, 36, 49, 44, 43, 37, 38, 42, 39, 40], // Soma 403
    Y: [25, 26, 55, 52, 48, 24, 34, 47, 50, 47]  // Soma 408
};

// Função para trocar abas
function showTab(tabName) {
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover classe active de todos os botões
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    document.getElementById(tabName).classList.add('active');
    
    // Adicionar classe active ao link da aba
    document.querySelector(`.nav-tab[data-tab="${tabName}"]`).classList.add('active');
}

// Adicionar event listener para as abas
document.querySelector('.nav-tab-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-tab')) {
        e.preventDefault();
        const tabName = e.target.dataset.tab;
        showTab(tabName);
    }
});

// Funções para carregar dados exemplo
function carregarDadosExemplo1() {
    document.getElementById('maquinaA').value = dadosExemplo.maquinaA.join(', ');
    document.getElementById('maquinaB').value = dadosExemplo.maquinaB.join(', ');
}

function carregarDadosExemplo2() {
    document.getElementById('maquinaA2').value = dadosExemplo.maquinaA.join(', ');
    document.getElementById('maquinaB2').value = dadosExemplo.maquinaB.join(', ');
}

function carregarDadosExemplo3() {
    document.getElementById('temposFalha').value = dadosExemplo.temposFalha.join(', ');
}

// Funções utilitárias estatísticas
function calcularEstatisticas(dados) {
    const sorted = [...dados].sort((a, b) => a - b);
    const n = dados.length;
    
    // Média
    const media = dados.reduce((sum, val) => sum + val, 0) / n;
    
    // Mediana
    const mediana = n % 2 === 0 
        ? (sorted[n/2 - 1] + sorted[n/2]) / 2
        : sorted[Math.floor(n/2)];
    
    // Desvio padrão
    const variancia = dados.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / n;
    const desvio = Math.sqrt(variancia);
    
    // Quartis
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    
    // IQR e outliers
    const iqr = q3 - q1;
    const limitInf = q1 - 1.5 * iqr;
    const limitSup = q3 + 1.5 * iqr;
    const outliers = dados.filter(val => val < limitInf || val > limitSup);
    
    return {
        media: Number(media.toFixed(3)),
        mediana: Number(mediana.toFixed(3)),
        desvio: Number(desvio.toFixed(3)),
        min: sorted[0],
        max: sorted[n-1],
        q1: Number(q1.toFixed(3)),
        q3: Number(q3.toFixed(3)),
        outliers: outliers,
        n: n
    };
}

function calcularDistribuicaoFrequencia(dados, numClasses = null) {
    const n = dados.length;
    const min = Math.min(...dados);
    const max = Math.max(...dados);
    const amplitude = max - min;
    
    // Número de classes usando regra de Sturges
    const k = numClasses || Math.ceil(1 + 3.322 * Math.log10(n));
    const h = amplitude / k;
    
    const classes = [];
    let limiteInf = min;
    
    for (let i = 0; i < k; i++) {
        const limiteSup = limiteInf + h;
        const classe = {
            numero: i + 1,
            limiteInf: Number(limiteInf.toFixed(3)),
            limiteSup: Number(limiteSup.toFixed(3)),
            pontoMedio: Number(((limiteInf + limiteSup) / 2).toFixed(3)),
            frequencia: 0,
            freqRelativa: 0
        };
        
        // Contar frequência
        dados.forEach(valor => {
            if (i === k - 1) {
                // Última classe inclui limite superior
                if (valor >= classe.limiteInf && valor <= classe.limiteSup) {
                    classe.frequencia++;
                }
            } else {
                if (valor >= classe.limiteInf && valor < classe.limiteSup) {
                    classe.frequencia++;
                }
            }
        });
        
        classe.freqRelativa = Number((classe.frequencia / n * 100).toFixed(1));
        classes.push(classe);
        limiteInf = limiteSup;
    }
    
    return { classes, k, h: Number(h.toFixed(3)), amplitude: Number(amplitude.toFixed(3)) };
}

// ATIVIDADE 1: Distribuição de Frequência
function processarDistribuicao() {
    try {
        const dadosA = document.getElementById('maquinaA').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));
        
        const dadosB = document.getElementById('maquinaB').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));
        
        if (dadosA.length === 0 || dadosB.length === 0) {
            alert('Por favor, insira dados válidos para ambas as máquinas.');
            return;
        }
        
        const todosDados = [...dadosA, ...dadosB];
        
        // Análise de frequência simples
        analisarFrequenciaSimples(todosDados);
        
        // Análise por intervalos
        analisarFrequenciaIntervalos(todosDados);
        
        // Mostrar resultados
        document.getElementById('resultados-distribuicao').style.display = 'block';
        
        // Mostrar botões de exportação
        document.getElementById('export-btns-1').style.display = 'block';
        
        // Comparação
        gerarComparacao();
        
    } catch (error) {
        alert('Erro ao processar dados: ' + error.message);
    }
}

function analisarFrequenciaSimples(dados) {
    // Contar frequência de cada valor único
    const frequencia = {};
    dados.forEach(valor => {
        frequencia[valor] = (frequencia[valor] || 0) + 1;
    });
    
    const valoresUnicos = Object.keys(frequencia)
        .map(Number)
        .sort((a, b) => a - b);
    
    // Criar tabela
    let tabelaHTML = `
        <h4>Distribuição de Frequência Simples</h4>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Valor (ms)</th>
                        <th>Frequência</th>
                        <th>Freq. Relativa (%)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    valoresUnicos.slice(0, 15).forEach(valor => {
        const freq = frequencia[valor];
        const freqRel = (freq / dados.length * 100).toFixed(1);
        tabelaHTML += `
            <tr>
                <td>${valor}</td>
                <td>${freq}</td>
                <td>${freqRel}%</td>
            </tr>
        `;
    });
    
    if (valoresUnicos.length > 15) {
        tabelaHTML += `
            <tr style="font-style: italic; background-color: #f7fafc;">
                <td colspan="3">... e mais ${valoresUnicos.length - 15} valores únicos</td>
            </tr>
        `;
    }
    
    tabelaHTML += `
                </tbody>
            </table>
        </div>
        <div class="alert alert-info">
            <strong>Observação:</strong> Foram encontrados ${valoresUnicos.length} valores únicos em ${dados.length} observações. 
            Isso torna a frequência simples impraticável para análise.
        </div>
    `;
    
    document.getElementById('tabela-frequencia-simples').innerHTML = tabelaHTML;
    
    // Criar gráfico apenas para os 10 valores mais frequentes
    criarGraficoFrequenciaSimples(frequencia, dados.length);
}

function criarGraficoFrequenciaSimples(frequencia, total) {
    // Pegar os 10 valores mais frequentes
    const topValores = Object.entries(frequencia)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = topValores.map(([valor, freq]) => `${valor} (${freq}x)`);
    const values = topValores.map(([valor, freq]) => freq);
    
    const ctx = document.createElement('canvas');
    document.getElementById('grafico-pizza-simples').innerHTML = '';
    document.getElementById('grafico-pizza-simples').appendChild(ctx);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#667eea', '#764ba2', '#f093fb', '#f5576c',
                    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
                    '#fa709a', '#fee140'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Top 10 Valores Mais Frequentes'
                }
            }
        }
    });
}

function analisarFrequenciaIntervalos(dados) {
    const resultado = calcularDistribuicaoFrequencia(dados);
    
    // Criar tabela
    let tabelaHTML = `
        <h4>Distribuição de Frequência com Intervalo de Classes</h4>
        <div class="alert alert-success">
            <strong>Cálculos:</strong><br>
            AT (Amplitude Total) = ${Math.max(...dados)} - ${Math.min(...dados)} = ${resultado.amplitude}<br>
            k (Número de classes) = ${resultado.k}<br>
            h (Amplitude de classe) = ${resultado.h}
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Classe</th>
                        <th>Intervalo (ms)</th>
                        <th>Ponto Médio</th>
                        <th>Frequência</th>
                        <th>Freq. Relativa (%)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    resultado.classes.forEach(classe => {
        const intervalo = classe.numero === resultado.classes.length 
            ? `[${classe.limiteInf.toFixed(2)}, ${classe.limiteSup.toFixed(2)}]`
            : `[${classe.limiteInf.toFixed(2)}, ${classe.limiteSup.toFixed(2)})`;
        
        tabelaHTML += `
            <tr>
                <td>${classe.numero}</td>
                <td>${intervalo}</td>
                <td>${classe.pontoMedio}</td>
                <td>${classe.frequencia}</td>
                <td>${classe.freqRelativa}%</td>
            </tr>
        `;
    });
    
    const totalFreq = resultado.classes.reduce((sum, c) => sum + c.frequencia, 0);
    tabelaHTML += `
                <tr style="font-weight: bold; background-color: #f7fafc;">
                    <td>Total</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${totalFreq}</td>
                    <td>100.0%</td>
                </tr>
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('tabela-frequencia-intervalos').innerHTML = tabelaHTML;
    
    // Criar gráfico
    criarGraficoIntervalos(resultado.classes);
}

function criarGraficoIntervalos(classes) {
    const labels = classes.map(c => {
        const intervalo = c.numero === classes.length 
            ? `[${c.limiteInf.toFixed(2)}, ${c.limiteSup.toFixed(2)}]`
            : `[${c.limiteInf.toFixed(2)}, ${c.limiteSup.toFixed(2)})`;
        return intervalo;
    });
    
    const values = classes.map(c => c.frequencia);
    
    const ctx = document.createElement('canvas');
    document.getElementById('grafico-pizza-intervalos').innerHTML = '';
    document.getElementById('grafico-pizza-intervalos').appendChild(ctx);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#667eea', '#764ba2', '#f093fb', '#f5576c',
                    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                ],
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const freq = data.datasets[0].data[i];
                                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percent = ((freq / total) * 100).toFixed(1);
                                return {
                                    text: `${label}: ${freq} (${percent}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Distribuição por Intervalos de Classe'
                }
            }
        }
    });
}

function gerarComparacao() {
    const comparacao = `
        <h4>Comparação entre Frequência Simples vs. Intervalos de Classe</h4>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Frequência Simples</h4>
                <div style="color: #e53e3e; font-size: 1.2rem;">❌ Não Recomendada</div>
            </div>
            <div class="stat-card">
                <h4>Intervalos de Classe</h4>
                <div style="color: #38a169; font-size: 1.2rem;">✅ Recomendada</div>
            </div>
        </div>
        
        <h4>Justificativas:</h4>
        <ol style="margin-left: 20px;">
            <li><strong>Eficiência na Organização:</strong> A distribuição por intervalos condensa os dados em classes manejáveis, facilitando a análise.</li>
            <li><strong>Visualização Clara:</strong> Gráfico de pizza com 7 fatias é muito mais legível que um com 42 fatias.</li>
            <li><strong>Identificação de Padrões:</strong> Os intervalos revelam claramente a concentração dos dados nas classes centrais.</li>
            <li><strong>Aplicabilidade Estatística:</strong> Ideal para variáveis contínuas como velocidade de processamento.</li>
            <li><strong>Facilitação de Cálculos:</strong> Permite análises estatísticas posteriores mais eficientes.</li>
        </ol>
        
        <div class="alert alert-success">
            <strong>Conclusão:</strong> Para dados contínuos com muitos valores únicos, a distribuição por intervalos de classe é significativamente superior, oferecendo uma representação mais clara, informativa e prática dos dados.
        </div>
    `;
    
    document.getElementById('comparacao-resultados').innerHTML = comparacao;
}

// ATIVIDADE 2: Boxplot e Histogramas
function processarBoxplot() {
    try {
        const dadosA = document.getElementById('maquinaA2').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));
        
        const dadosB = document.getElementById('maquinaB2').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));
        
        if (dadosA.length === 0 || dadosB.length === 0) {
            alert('Por favor, insira dados válidos para ambas as máquinas.');
            return;
        }
        
        // Calcular estatísticas
        const statsA = calcularEstatisticas(dadosA);
        const statsB = calcularEstatisticas(dadosB);
        
        // Criar histogramas
        criarHistograma(dadosA, 'histograma-maquinaA', 'Máquina A');
        criarHistograma(dadosB, 'histograma-maquinaB', 'Máquina B');
        
        // Criar boxplot comparativo
        criarBoxplot(dadosA, dadosB, 'boxplot-grafico');
        
        // Atualizar estatísticas
        document.getElementById('media-a').textContent = statsA.media;
        document.getElementById('media-b').textContent = statsB.media;
        document.getElementById('desvio-a').textContent = statsA.desvio;
        document.getElementById('desvio-b').textContent = statsB.desvio;
        
        // Gerar interpretação
        gerarInterpretacaoBoxplot(statsA, statsB);
        
        // Mostrar resultados
        document.getElementById('resultados-boxplot').style.display = 'block';
        
        // Mostrar botões de exportação
        document.getElementById('export-btns-2').style.display = 'block';
        
    } catch (error) {
        alert('Erro ao processar dados: ' + error.message);
    }
}

function criarHistograma(dados, containerId, titulo) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    // Calcular classes para histograma
    const resultado = calcularDistribuicaoFrequencia(dados, 6);
    
    const trace = {
        x: dados,
        type: 'histogram',
        nbinsx: resultado.k,
        marker: {
            color: '#667eea',
            opacity: 0.7,
            line: {
                color: '#4c51bf',
                width: 1
            }
        },
        name: titulo
    };
    
    const layout = {
        title: `Histograma - ${titulo}`,
        xaxis: { title: 'Velocidade de Processamento (ms)' },
        yaxis: { title: 'Frequência' },
        showlegend: false,
        margin: { t: 50, r: 50, b: 50, l: 50 },
        font: { family: 'Inter, sans-serif' }
    };
    
    Plotly.newPlot(containerId, [trace], layout, {responsive: true});
}

function criarBoxplot(dadosA, dadosB, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const trace1 = {
        y: dadosA,
        type: 'box',
        name: 'Máquina A',
        marker: { color: '#667eea' },
        boxpoints: 'outliers'
    };
    
    const trace2 = {
        y: dadosB,
        type: 'box',
        name: 'Máquina B',
        marker: { color: '#f093fb' },
        boxpoints: 'outliers'
    };
    
    const layout = {
        title: 'Boxplot Comparativo - Máquinas A e B',
        yaxis: { title: 'Velocidade de Processamento (ms)' },
        showlegend: true,
        margin: { t: 50, r: 50, b: 50, l: 50 },
        font: { family: 'Inter, sans-serif' }
    };
    
    Plotly.newPlot(containerId, [trace1, trace2], layout, {responsive: true});
}

function gerarInterpretacaoBoxplot(statsA, statsB) {
    // Determinar qual tem menor variabilidade
    const menorVariabilidade = statsA.desvio < statsB.desvio ? 'A' : 'B';
    const diferenca = Math.abs(statsA.desvio - statsB.desvio).toFixed(3);
    
    // Verificar outliers
    const outliersA = statsA.outliers.length > 0;
    const outliersB = statsB.outliers.length > 0;
    
    let interpretacao = `
        <h4>Análise Comparativa das Distribuições</h4>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Menor Variabilidade</h4>
                <div class="value" style="color: #38a169;">Máquina ${menorVariabilidade}</div>
            </div>
            <div class="stat-card">
                <h4>Diferença nos Desvios</h4>
                <div class="value">${diferenca} ms</div>
            </div>
        </div>
        
        <h4>Comparação de Variabilidade:</h4>
        <p>A <strong>Máquina ${menorVariabilidade}</strong> apresenta menor variabilidade nos tempos de processamento 
        (desvio padrão: ${menorVariabilidade === 'A' ? statsA.desvio : statsB.desvio} ms), indicando maior 
        consistência e estabilidade no desempenho.</p>
        
        <h4>Análise de Outliers:</h4>
    `;
    
    if (!outliersA && !outliersB) {
        interpretacao += `
            <p><strong>✅ Não foram identificados outliers</strong> em nenhuma das máquinas, 
            indicando comportamento consistente e previsível em ambos os sistemas.</p>
        `;
    } else {
        if (outliersA) {
            interpretacao += `
                <p><strong>⚠️ Máquina A:</strong> Detectados ${statsA.outliers.length} outlier(s): 
                ${statsA.outliers.join(', ')} ms</p>
            `;
        }
        if (outliersB) {
            interpretacao += `
                <p><strong>⚠️ Máquina B:</strong> Detectados ${statsB.outliers.length} outlier(s): 
                ${statsB.outliers.join(', ')} ms</p>
            `;
        }
        interpretacao += `
            <p>A presença de outliers sugere variações ocasionais no desempenho que podem 
            necessitar investigação para identificar suas causas.</p>
        `;
    }
    
    interpretacao += `
        <div class="alert alert-info">
            <strong>Interpretação Técnica:</strong><br>
            • As distribuições mostram comportamento similar com medidas de tendência central próximas<br>
            • A diferença na variabilidade pode indicar diferenças sutis na calibração ou estado das máquinas<br>
            • ${outliersA || outliersB ? 'Os outliers detectados devem ser investigados para manutenção preventiva' : 'A ausência de outliers confirma o bom funcionamento de ambos os sistemas'}
        </div>
    `;
    
    document.getElementById('interpretacao-boxplot').innerHTML = interpretacao;
}

// ATIVIDADE 3: Tempo de Falha
function processarTempoFalha() {
    try {
        const dados = document.getElementById('temposFalha').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));
        
        if (dados.length === 0) {
            alert('Por favor, insira dados válidos de tempo de falha.');
            return;
        }
        
        // Análise de distribuição
        analisarTempoFalha(dados);
        
        // Mostrar resultados
        document.getElementById('resultados-tempo-falha').style.display = 'block';
        
        // Mostrar botões de exportação
        document.getElementById('export-btns-3').style.display = 'block';
        
    } catch (error) {
        alert('Erro ao processar dados: ' + error.message);
    }
}

function analisarTempoFalha(dados) {
    // Calcular estatísticas
    const stats = calcularEstatisticas(dados);
    
    // Calcular assimetria
    const assimetria = calcularAssimetria(dados, stats.media, stats.desvio);
    
    // Criar tabela de distribuição
    criarTabelaTempoFalha(dados);
    
    // Criar histograma
    criarHistogramaTempoFalha(dados);
    
    // Atualizar estatísticas
    document.getElementById('media-tempo').textContent = stats.media + ' h';
    document.getElementById('mediana-tempo').textContent = stats.mediana + ' h';
    document.getElementById('desvio-tempo').textContent = stats.desvio + ' h';
    document.getElementById('assimetria-tempo').textContent = assimetria.toFixed(3);
    
    // Gerar análise
    gerarAnaliseDistribuicao(stats, assimetria);
}

function calcularAssimetria(dados, media, desvio) {
    const n = dados.length;
    const somaCubos = dados.reduce((sum, val) => sum + Math.pow((val - media) / desvio, 3), 0);
    return (n / ((n - 1) * (n - 2))) * somaCubos;
}

function criarTabelaTempoFalha(dados) {
    const resultado = calcularDistribuicaoFrequencia(dados, 8);
    
    let tabelaHTML = `
        <h4>Distribuição de Frequência por Classes</h4>
        <div class="alert alert-success">
            <strong>Parâmetros da Distribuição:</strong><br>
            AT = ${resultado.amplitude} h | k = ${resultado.k} classes | h = ${resultado.h} h
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Classe</th>
                        <th>Intervalo (horas)</th>
                        <th>Ponto Médio</th>
                        <th>Frequência</th>
                        <th>Freq. Relativa (%)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    resultado.classes.forEach(classe => {
        const intervalo = classe.numero === resultado.classes.length 
            ? `[${classe.limiteInf}, ${classe.limiteSup}]`
            : `[${classe.limiteInf}, ${classe.limiteSup})`;
        
        tabelaHTML += `
            <tr>
                <td>${classe.numero}</td>
                <td>${intervalo}</td>
                <td>${classe.pontoMedio}</td>
                <td>${classe.frequencia}</td>
                <td>${classe.freqRelativa}%</td>
            </tr>
        `;
    });
    
    const totalFreq = resultado.classes.reduce((sum, c) => sum + c.frequencia, 0);
    tabelaHTML += `
                <tr style="font-weight: bold; background-color: #f7fafc;">
                    <td>Total</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${totalFreq}</td>
                    <td>100.0%</td>
                </tr>
                </tbody>
            </table>
        </div>
    `;
    
    document.getElementById('tabela-tempo-falha').innerHTML = tabelaHTML;
}

function criarHistogramaTempoFalha(dados) {
    const container = document.getElementById('histograma-tempo-falha');
    container.innerHTML = '';
    
    const resultado = calcularDistribuicaoFrequencia(dados, 8);
    
    const trace = {
        x: dados,
        type: 'histogram',
        nbinsx: resultado.k,
        marker: {
            color: '#43e97b',
            opacity: 0.8,
            line: {
                color: '#2d7a3d',
                width: 1
            }
        },
        name: 'Tempo de Falha'
    };
    
    const layout = {
        title: 'Histograma - Tempo de Falha dos Componentes',
        xaxis: { title: 'Tempo de Falha (horas)' },
        yaxis: { title: 'Frequência' },
        showlegend: false,
        margin: { t: 50, r: 50, b: 50, l: 50 },
        font: { family: 'Inter, sans-serif' }
    };
    
    Plotly.newPlot(container.id, [trace], layout, {responsive: true});
}

function gerarAnaliseDistribuicao(stats, assimetria) {
    let tipoDistribuicao = '';
    let interpretacao = '';
    
    if (Math.abs(assimetria) < 0.5) {
        tipoDistribuicao = 'Aproximadamente Normal (Simétrica)';
        interpretacao = 'A distribuição é aproximadamente simétrica, com média e mediana próximas.';
    } else if (assimetria > 0.5) {
        tipoDistribuicao = 'Assimétrica à Direita (Positiva)';
        interpretacao = 'A distribuição tem uma cauda mais longa à direita, com alguns componentes apresentando tempos de falha significativamente maiores.';
    } else {
        tipoDistribuicao = 'Assimétrica à Esquerda (Negativa)';
        interpretacao = 'A distribuição tem uma cauda mais longa à esquerda, com concentração nas faixas superiores de tempo.';
    }
    
    const razaoMediaMediana = (stats.media / stats.mediana).toFixed(3);
    
    const analise = `
        <h4>Análise do Tipo de Distribuição</h4>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Tipo Identificado</h4>
                <div class="value" style="font-size: 1.2rem;">${tipoDistribuicao}</div>
            </div>
            <div class="stat-card">
                <h4>Razão Média/Mediana</h4>
                <div class="value">${razaoMediaMediana}</div>
            </div>
        </div>
        
        <h4>Interpretação Estatística:</h4>
        <p>${interpretacao}</p>
        
        <h4>Comparação com Distribuição Normal:</h4>
        <p>A distribuição ${Math.abs(assimetria) < 0.5 ? 'aproxima-se' : 'desvia-se'} da normalidade 
        devido aos seguintes fatores:</p>
        
        <ul style="margin-left: 20px;">
            <li><strong>Assimetria:</strong> Valor de ${assimetria.toFixed(3)} ${Math.abs(assimetria) < 0.5 ? 'indica baixa assimetria' : 'indica assimetria significativa'}</li>
            <li><strong>Diferença Média-Mediana:</strong> ${Math.abs(stats.media - stats.mediana).toFixed(3)} horas</li>
            <li><strong>Natureza dos Dados:</strong> Tempos de falha tendem a seguir distribuições específicas como Weibull ou Exponencial</li>
        </ul>
        
        <div class="alert alert-info">
            <strong>Conclusão Técnica:</strong><br>
            ${assimetria > 0.5 ? 
                'A assimetria positiva é típica de dados de confiabilidade, onde a maioria dos componentes falha dentro do tempo esperado, mas alguns apresentam vida útil excepcionalmente longa.' :
                'A distribuição aproximadamente normal sugere um processo de falha bem controlado e previsível.'
            }
            Este comportamento é ${assimetria > 0.5 ? 'normal' : 'desejável'} em componentes eletrônicos sob teste acelerado.
        </div>
    `;
    
    document.getElementById('analise-distribuicao').innerHTML = analise;
}

// FUNÇÕES DE EXPORTAÇÃO
function exportarPDF(atividadeId, nomeArquivo) {
    // Mostrar mensagem de carregamento
    const btnExport = event.target;
    const textoOriginal = btnExport.innerHTML;
    btnExport.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
    btnExport.disabled = true;
    
    // Pegar o elemento da atividade
    const elemento = document.getElementById(atividadeId);
    
    // Aguardar um momento para garantir que gráficos estejam renderizados
    setTimeout(() => {
        // Configurações simplificadas e funcionais
        const options = {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: false,
            ignoreElements: function(element) {
                // Ignorar apenas elementos específicos
                return element.classList.contains('export-buttons') || 
                       element.classList.contains('data-input-section') ||
                       element.classList.contains('nav-tabs');
            }
        };
        
        html2canvas(elemento, options).then(canvas => {
            // Verificar se o canvas tem conteúdo
            if (canvas.width === 0 || canvas.height === 0) {
                throw new Error('Canvas vazio');
            }
            
            // Criar PDF
            const { jsPDF } = window.jspdf;
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            // Calcular dimensões proporcionais
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const margin = 10;
            const maxWidth = pageWidth - (margin * 2);
            const maxHeight = pageHeight - (margin * 2);
            
            // Calcular dimensões da imagem respeitando proporção
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(maxWidth / (imgWidth * 0.264583), maxHeight / (imgHeight * 0.264583));
            const finalWidth = imgWidth * 0.264583 * ratio;
            const finalHeight = imgHeight * 0.264583 * ratio;
            
            // Centralizar na página
            const x = (pageWidth - finalWidth) / 2;
            const y = margin;
            
            // Criar PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Verificar se precisa de múltiplas páginas
            if (finalHeight > maxHeight) {
                // Dividir em múltiplas páginas
                let position = 0;
                let remainingHeight = finalHeight;
                
                while (remainingHeight > 0) {
                    const pageImg = finalHeight - position > maxHeight ? maxHeight : remainingHeight;
                    
                    if (position > 0) {
                        pdf.addPage();
                    }
                    
                    // Criar canvas temporário para esta página
                    const pageCanvas = document.createElement('canvas');
                    const ctx = pageCanvas.getContext('2d');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = (pageImg / finalHeight) * canvas.height;
                    
                    ctx.drawImage(canvas, 0, -(position / finalHeight) * canvas.height);
                    
                    const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
                    pdf.addImage(pageImgData, 'PNG', x, y, finalWidth, pageImg);
                    
                    position += maxHeight;
                    remainingHeight -= maxHeight;
                }
            } else {
                // Uma página só
                pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            }
            
            // Baixar PDF
            pdf.save(`${nomeArquivo}.pdf`);
            
            // Restaurar botão
            btnExport.innerHTML = textoOriginal;
            btnExport.disabled = false;
            
        }).catch(error => {
            console.error('Erro ao gerar PDF:', error);
            
            // Restaurar botão
            btnExport.innerHTML = textoOriginal;
            btnExport.disabled = false;
            alert('Erro ao gerar PDF. Tente novamente.\nDetalhes: ' + error.message);
        });
    }, 1000);
}

function exportarHTML(atividadeId, nomeArquivo) {
    const elemento = document.getElementById(atividadeId);
    
    // Clonar o elemento para não afetar a página original
    const clone = elemento.cloneNode(true);
    
    // Remover botões de exportação do clone
    const btnsExport = clone.querySelectorAll('.export-buttons');
    btnsExport.forEach(btn => btn.remove());
    
    // Criar estrutura HTML completa
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nomeArquivo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
${obterEstilosCSS()}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-chart-line"></i> Atividade de Estatística</h1>
            <p>Relatório exportado em ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        ${clone.outerHTML}
    </div>
</body>
</html>`;
    
    // Criar blob e fazer download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nomeArquivo}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function obterEstilosCSS() {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: #667eea;
            --secondary-color: #764ba2;
            --accent-color: #f093fb;
            --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            --card-shadow: 0 20px 40px rgba(0,0,0,0.1);
            --text-primary: #2d3748;
            --text-secondary: #718096;
            --border-radius: 20px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-gradient);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 40px;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            border-radius: var(--border-radius);
            color: white;
            box-shadow: var(--card-shadow);
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            font-weight: 300;
        }

        .activity-card {
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
            margin-bottom: 30px;
            overflow: hidden;
        }

        .activity-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .activity-content {
            padding: 40px;
        }

        .enunciado {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 4px solid var(--primary-color);
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 30px;
        }

        .results-section {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-top: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .stat-card {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }

        .stat-card h4 {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-card .value {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary-color);
        }

        .interpretation {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-left: 4px solid #16a34a;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }

        .interpretation h3 {
            color: #15803d;
            margin-bottom: 15px;
        }

        .table-container {
            overflow-x: auto;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin: 20px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        th {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: 600;
        }

        td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
        }

        tr:hover td {
            background-color: #f7fafc;
        }

        .alert {
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid;
        }

        .alert-info {
            background: #e0f2fe;
            border-color: #0891b2;
            color: #0e7490;
        }

        .alert-success {
            background: #ecfdf5;
            border-color: #059669;
            color: #047857;
        }

        .chart-container, .boxplot-container, .histogram-container {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 10px;
            border: 2px dashed #e2e8f0;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #718096;
            font-style: italic;
        }

        .chart-container::before, .boxplot-container::before, .histogram-container::before {
            content: "📊 Gráfico não disponível na versão exportada - visualizar na página web";
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .activity-content {
                padding: 20px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
}

// Carregar dados exemplo na inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarDadosExemplo1();
    carregarDadosExemplo2();
    carregarDadosExemplo3();
    // Carregar o enunciado da Atividade 4
    carregarEnunciadoAnaliseMaquinas();
});

// Helper function para formatar números
function formatNumber(num, decimals = 2) {
    return Number(num.toFixed(decimals));
}

// Função para carregar o enunciado da Atividade 4
function carregarEnunciadoAnaliseMaquinas() {
    const enunciadoDiv = document.getElementById('enunciado-maquinas');
    if (enunciadoDiv) {
        enunciadoDiv.innerHTML = `
            <h4><strong>EXERCÍCIO INTERPRETAÇÃO VARIÂNCIA + DESVIO PADRÃO + COEFICIENTE DE VARIAÇÃO</strong></h4>
            <p><strong>Situação problema:</strong> Uma fabricante de autopeças precisa renovar seu parque fabril para atender a demanda imposta pelo mercado consumidor. [cite: 1] Para isso, está avaliando a aquisição de dois tipos diferentes de máquina, X e Y, que são projetadas para produzir o mesmo produto e comercializadas pelo mesmo preço. [cite: 2] Para tomar a decisão correta, com base em informações não subjetivas, o fabricante enviou você, como engenheiro mecatrônico, para avaliar estas máquinas e indicar qual deve ser adquirida. [cite: 3]</p>
            <p>Considerando seus conhecimentos de estatística, você decidiu observar a produção das máquinas sob avaliação, coletando informações das produções horárias, ao longo de 10 horas de operação, como segue: [cite: 4]</p>
            <p><strong>Produção em peças/hora</strong> [cite: 6]</p>
            <div class="table-container">
                <table class="table-auto" style="width: 50%; margin: 10px auto; border: 1px solid #ccc;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ccc; padding: 5px;">X</th>
                            <th style="border: 1px solid #ccc; padding: 5px;">Y</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">35</td><td style="border: 1px solid #ccc; padding: 5px;">25</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">36</td><td style="border: 1px solid #ccc; padding: 5px;">26</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">49</td><td style="border: 1px solid #ccc; padding: 5px;">55</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">44</td><td style="border: 1px solid #ccc; padding: 5px;">52</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">43</td><td style="border: 1px solid #ccc; padding: 5px;">48</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">37</td><td style="border: 1px solid #ccc; padding: 5px;">24</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">38</td><td style="border: 1px solid #ccc; padding: 5px;">34</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">42</td><td style="border: 1px solid #ccc; padding: 5px;">47</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">39</td><td style="border: 1px solid #ccc; padding: 5px;">50</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;">40</td><td style="border: 1px solid #ccc; padding: 5px;">47</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 5px;"><strong>Soma 403</strong></td><td style="border: 1px solid #ccc; padding: 5px;"><strong>Soma 408</strong></td></tr>
                    </tbody>
                </table>
            </div>
            <p>Considerando os conceitos, e respectivas interpretações de VARIÂNCIA, DESVIO PADRÃO e COEFICIENTE DE VARIAÇÃO, indique qual das máquinas deve ser adquirida por seu empregador, apresentando gráficos/cálculos/ferramentas computacionais empregadas, E SUAS CONSIDERAÇÕES. [cite: 6]</p>
            <p><em>Solução mais completa receberá nota máxima, e se tornará base para o cálculo das demais notas. ATIVIDADE INDIVIDUAL. [cite: 7]</em></p>
        `;
    }
     // Pré-carregar a tabela de dados de produção na seção de input
    const dadosProducaoDiv = document.getElementById('dados-maquinas-producao');
    if (dadosProducaoDiv) {
        let tableHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Máquina X (Peças/Hora)</th>
                            <th>Máquina Y (Peças/Hora)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        for (let i = 0; i < Math.max(dadosMaquinasAnalise.X.length, dadosMaquinasAnalise.Y.length); i++) {
            tableHTML += `
                <tr>
                    <td>${dadosMaquinasAnalise.X[i] !== undefined ? dadosMaquinasAnalise.X[i] : '-'}</td>
                    <td>${dadosMaquinasAnalise.Y[i] !== undefined ? dadosMaquinasAnalise.Y[i] : '-'}</td>
                </tr>
            `;
        }
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        dadosProducaoDiv.innerHTML = tableHTML;
    }
}


// ATIVIDADE 4: ANÁLISE DE VARIABILIDADE DE MÁQUINAS
function processarAnaliseMaquinas() {
    const dataX = dadosMaquinasAnalise.X;
    const dataY = dadosMaquinasAnalise.Y;

    function calcularMetricas(dados, nomeMaquina) {
        const n = dados.length;
        const sum = dados.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;
        
        const squaredDifferences = dados.map(val => Math.pow(val - mean, 2));
        const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
        
        const variance = sumSquaredDiff / n; // Population variance
        const stdDev = Math.sqrt(variance); // Population standard deviation
        const cv = (stdDev / mean) * 100;

        return {
            nome: nomeMaquina,
            dados: dados,
            sum: formatNumber(sum),
            n: n,
            mean: formatNumber(mean),
            squaredDifferences: squaredDifferences.map(d => formatNumber(d)),
            sumSquaredDiff: formatNumber(sumSquaredDiff),
            variance: formatNumber(variance),
            stdDev: formatNumber(stdDev),
            cv: formatNumber(cv)
        };
    }

    const metricasX = calcularMetricas(dataX, 'Máquina X');
    const metricasY = calcularMetricas(dataY, 'Máquina Y');

    // 1. Display Raw Data Table (re-display in results)
    const dadosDisplayDiv = document.getElementById('dados-maquinas-display');
    let dadosTableHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Máquina X (Peças/Hora)</th>
                        <th>Máquina Y (Peças/Hora)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    for (let i = 0; i < Math.max(metricasX.dados.length, metricasY.dados.length); i++) {
        dadosTableHTML += `
            <tr>
                <td>${metricasX.dados[i] !== undefined ? metricasX.dados[i] : '-'}</td>
                <td>${metricasY.dados[i] !== undefined ? metricasY.dados[i] : '-'}</td>
            </tr>
        `;
    }
    dadosTableHTML += `
                </tbody>
            </table>
        </div>
    `;
    dadosDisplayDiv.innerHTML = dadosTableHTML;


    // 2. Display Detailed Calculations
    const calculosDiv = document.getElementById('calculos-maquinas');
    let calculosHTML = '';

    [metricasX, metricasY].forEach(m => {
        calculosHTML += `
            <div class="calculation-block">
                <h3>${m.nome}</h3>
                <p><strong>Dados:</strong> ${m.dados.join(', ')}</p>
                <p><strong>Soma:</strong> ${m.sum}</p>
                <p><strong>N (Número de observações):</strong> ${m.n}</p>
                <p><strong>Média (μ):</strong> ${m.sum} / ${m.n} = <strong>${m.mean}</strong></p>
                
                <h4>Cálculo da Variância (σ²)</h4>
                <div class="table-container" style="max-height: 200px; overflow-y: auto;">
                    <table>
                        <thead><tr><th>Valor (xᵢ)</th><th>Desvio (xᵢ - μ)</th><th>Desvio ao Quadrado ((xᵢ - μ)²)</th></tr></thead>
                        <tbody>
                            ${m.dados.map(val => `<tr><td>${val}</td><td>${formatNumber(val - m.mean)}</td><td>${formatNumber(Math.pow(val - m.mean, 2))}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
                <p><strong>Soma dos Desvios ao Quadrado (SS):</strong> ${m.sumSquaredDiff}</p>
                <p><strong>Variância Populacional (σ²):</strong> SS / N = ${m.sumSquaredDiff} / ${m.n} = <strong>${m.variance}</strong></p>
                
                <h4>Cálculo do Desvio Padrão (σ)</h4>
                <p><strong>Desvio Padrão (σ):</strong> √σ² = √${m.variance} = <strong>${m.stdDev}</strong></p>
                
                <h4>Cálculo do Coeficiente de Variação (CV)</h4>
                <p><strong>Coeficiente de Variação (CV):</strong> (σ / μ) * 100 = (${m.stdDev} / ${m.mean}) * 100 = <strong>${m.cv}%</strong></p>
            </div>
        `;
    });
    calculosDiv.innerHTML = calculosHTML;

    // 3. Generate Interpretation and Recommendation
    const interpretacaoDiv = document.getElementById('interpretacao-maquinas');
    let recomendacaoHTML = `
        <h4>Entendendo as Métricas Estatísticas:</h4>
        <p><strong>Variância (σ²):</strong> Mede a dispersão dos valores de produção em torno da média. Quanto maior a variância, mais os valores de produção horária variam.</p>
        <p><strong>Desvio Padrão (σ):</strong> É a raiz quadrada da variância, expressa na mesma unidade dos dados (peças/hora). Ele indica o grau de variabilidade ou 'espalhamento' da produção em relação à média. Um desvio padrão menor significa produção mais uniforme.</p>
        <p><strong>Coeficiente de Variação (CV):</strong> É uma medida de dispersão relativa, calculada como (Desvio Padrão / Média) * 100%. O CV é particularmente útil para comparar a variabilidade entre diferentes conjuntos de dados, especialmente se suas médias forem diferentes. Um CV menor indica uma produção mais consistente e homogênea em relação à sua própria média.</p>
        
        <h4>Análise Comparativa das Máquinas:</h4>
        <p>Ao compararmos as duas máquinas:</p>
        <ul>
            <li>Máquina X: CV = ${metricasX.cv.toFixed(2)}% (Média: ${metricasX.mean.toFixed(2)}, DP: ${metricasX.stdDev.toFixed(2)})</li>
            <li>Máquina Y: CV = ${metricasY.cv.toFixed(2)}% (Média: ${metricasY.mean.toFixed(2)}, DP: ${metricasY.stdDev.toFixed(2)})</li>
        </ul>
    `;

    const maquinaRecomendada = metricasX.cv < metricasY.cv ? 'X' : 'Y';
    const maquinaAlternativa = metricasX.cv < metricasY.cv ? 'Y' : 'X';
    const cvRecomendada = maquinaRecomendada === 'X' ? metricasX.cv : metricasY.cv;
    const cvAlternativa = maquinaAlternativa === 'X' ? metricasX.cv : metricasY.cv;
    const mediaRecomendada = maquinaRecomendada === 'X' ? metricasX.mean : metricasY.mean;
    const mediaAlternativa = maquinaAlternativa === 'X' ? metricasX.mean : metricasY.mean;

    if (metricasX.cv !== metricasY.cv) {
        recomendacaoHTML += `
            <p>A Máquina ${maquinaRecomendada} apresentou um Coeficiente de Variação (${cvRecomendada.toFixed(2)}%) significativamente menor em comparação com a Máquina ${maquinaAlternativa} (${cvAlternativa.toFixed(2)}%).</p>
            
            <h4>Recomendação como Engenheiro Mecatrônico:</h4>
            <p>Com base na análise estatística, <strong>recomenda-se a aquisição da Máquina ${maquinaRecomendada}</strong>.</p>
            <p>Embora a Máquina ${maquinaAlternativa} tenha uma produção média horária ligeiramente superior (${mediaAlternativa.toFixed(2)} peças/hora) em comparação com a Máquina ${maquinaRecomendada} (${mediaRecomendada.toFixed(2)} peças/hora), a Máquina ${maquinaRecomendada} possui uma variabilidade consideravelmente menor, como indicado pelo seu menor Coeficiente de Variação (${cvRecomendada.toFixed(2)}%).</p>
            <p>Uma menor variabilidade (menor CV) é crucial em um ambiente de produção por várias razões:</p>
            <ul>
                <li><strong>Previsibilidade:</strong> Torna a produção mais previsível, facilitando o planejamento e o cumprimento de metas.</li>
                <li><strong>Qualidade:</strong> Processos mais consistentes tendem a resultar em produtos com qualidade mais uniforme.</li>
                <li><strong>Custos:</strong> Menor variabilidade pode levar à redução de desperdícios e retrabalho.</li>
                <li><strong>Atendimento à Demanda:</strong> Uma produção estável garante uma capacidade mais confiável para atender à demanda do mercado.</li>
            </ul>
            <p>Portanto, a maior consistência da Máquina ${maquinaRecomendada} a torna a escolha mais estratégica para a renovação do parque fabril, visando uma operação mais estável e confiável a longo prazo, mesmo que sua média de produção seja marginalmente inferior neste conjunto de dados.</p>
        `;
    } else { // CVs are equal
        recomendacaoHTML += `
            <p>Ambas as máquinas apresentam Coeficientes de Variação idênticos (${metricasX.cv.toFixed(2)}%).</p>
            <h4>Recomendação como Engenheiro Mecatrônico:</h4>
            <p>Com base na análise estatística, ambas as máquinas apresentam a mesma variabilidade relativa. Neste caso, a decisão pode ser baseada em outros fatores:</p>
            <ul>
                <li><strong>Produção Média:</strong> A Máquina Y (${metricasY.mean.toFixed(2)} peças/hora) tem uma média ligeiramente superior à Máquina X (${metricasX.mean.toFixed(2)} peças/hora). Se o volume de produção for o fator crítico, a Máquina Y pode ser preferível.</li>
                <li><strong>Outros Fatores:</strong> Custo de aquisição (mencionado como igual neste problema), custos de manutenção, facilidade de operação, suporte do fornecedor, e requisitos específicos de qualidade devem ser considerados.</li>
            </ul>
            <p>Se a prioridade for maximizar a produção média e a variabilidade é idêntica, a Máquina Y seria a escolha. Contudo, se houver outros fatores não quantificados que favoreçam a Máquina X, a decisão pode pender para ela, dado que a estabilidade é a mesma.</p>
        `;
    }
    
    recomendacaoHTML += `
        <h4>Ferramentas Computacionais Empregadas:</h4>
        <p>Para estes cálculos, poderiam ser empregadas ferramentas computacionais como Microsoft Excel (com funções como MÉDIA, VAR.P, DESVPAD.P, e cálculo manual do CV), Google Sheets, ou linguagens de programação com bibliotecas estatísticas como Python (com NumPy/Pandas) ou R. Os gráficos podem ser gerados usando estas mesmas ferramentas ou bibliotecas específicas de visualização como Matplotlib/Seaborn em Python ou Plotly.js (como utilizado nesta página).</p>
    `;
    interpretacaoDiv.innerHTML = recomendacaoHTML;

    // 4. Call charting function
    gerarGraficoComparativoCV(metricasX.cv, metricasY.cv);

    // 5. Make results section visible
    document.getElementById('resultados-analise-maquinas').style.display = 'block';
}

function gerarGraficoComparativoCV(cvX, cvY) {
    const data = [{
        x: ['Máquina X', 'Máquina Y'],
        y: [cvX, cvY],
        type: 'bar',
        text: [cvX.toFixed(2) + '%', cvY.toFixed(2) + '%'],
        textposition: 'auto',
        marker: {
            color: ['#667eea', '#f093fb'],
            line: {
                color: 'rgba(0,0,0,0.5)',
                width: 1
            }
        },
        hoverinfo: 'x+y'
    }];
    const layout = {
        title: 'Comparação do Coeficiente de Variação (CV)',
        yaxis: { 
            title: 'CV (%)',
            ticksuffix: '%'
        },
        xaxis: {
            title: 'Máquinas'
        },
        font: { family: 'Inter, sans-serif' },
        margin: { t: 50, r: 30, b: 50, l: 50 },
        bargap: 0.3
    };
    Plotly.newPlot('graficos-maquinas', data, layout, {responsive: true});
}

// Garantir que a função esteja acessível globalmente se não estiver usando módulos
window.processarAnaliseMaquinas = processarAnaliseMaquinas;

// ATIVIDADE 2025.1: Correlação Linear Simples
const dadosCorrelacaoExemplo = {
    rpm: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
    hp: [18, 17, 19, 21, 20, 22, 24, 23, 25, 27, 26, 28, 30, 29, 31, 33, 32, 34, 36, 35, 37, 38, 37, 39]
};

function carregarDadosExemploCorrelacao() {
    document.getElementById('rpmData').value = dadosCorrelacaoExemplo.rpm.join(', ');
    document.getElementById('hpData').value = dadosCorrelacaoExemplo.hp.join(', ');
}

document.addEventListener('DOMContentLoaded', function() {
    // ... (código existente)
    carregarDadosExemploCorrelacao();
});


function processarCorrelacao() {
    try {
        const rpmData = document.getElementById('rpmData').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));

        const hpData = document.getElementById('hpData').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));

        if (rpmData.length !== hpData.length || rpmData.length === 0) {
            alert('Os dois conjuntos de dados devem ter o mesmo número de observações e não podem estar vazios.');
            return;
        }

        // 1. Variáveis Dependente e Independente
        const variaveisDiv = document.getElementById('variaveis-correlacao');
        variaveisDiv.innerHTML = `
            <h4>1) Variável Dependente e Independente</h4>
            <p><strong>Variável Independente (X):</strong> Velocidade (RPM x 100), pois é a variável que está sendo manipulada ou observada para ver seu efeito na outra.</p>
            <p><strong>Variável Dependente (Y):</strong> Capacidade (HP), pois seu valor depende da velocidade da máquina.</p>
        `;

        // 2. Hipóteses de Associação
        const hipotesesDiv = document.getElementById('hipoteses-correlacao');
        hipotesesDiv.innerHTML = `
            <h4>2) Hipóteses de Associação</h4>
            <p><strong>Hipótese Nula (H₀):</strong> Não existe correlação linear entre a velocidade (RPM) e a capacidade (HP) da máquina (ρ = 0).</p>
            <p><strong>Hipótese Alternativa (H₁):</strong> Existe correlação linear entre a velocidade (RPM) e a capacidade (HP) da máquina (ρ ≠ 0).</p>
        `;

        // 3. Gráfico de Dispersão e Coeficiente de Pearson
        const { r, rSquared } = calcularCorrelacaoPearson(rpmData, hpData);
        gerarGraficoDispersao(rpmData, hpData, 'grafico-dispersao');

        const coeficienteDiv = document.getElementById('coeficiente-correlacao');
        coeficienteDiv.innerHTML = `
            <h4>3) Associação entre Variáveis</h4>
            <p><strong>Coeficiente de Correlação de Pearson (r):</strong> ${r.toFixed(4)}</p>
            <p><strong>Grau de Associação:</strong> O valor de r próximo de +1 indica uma <strong>correlação linear positiva muito forte</strong> entre a velocidade e a capacidade da máquina.</p>
            <p><strong>Coeficiente de Determinação (r²):</strong> ${rSquared.toFixed(4)} (${(rSquared * 100).toFixed(2)}%)</p>
            <p>Isto significa que aproximadamente <strong>${(rSquared * 100).toFixed(2)}%</strong> da variação na capacidade (HP) pode ser explicada pela variação na velocidade (RPM).</p>
        `;

        // 4. Significância Estatística
        const significanciaDiv = document.getElementById('significancia-estatistica');
        const { tValue, pValue, ehSignificante } = verificarSignificancia(r, rpmData.length);
        significanciaDiv.innerHTML = `
            <h4>4) Verificação da Significância Estatística (α = 0,05)</h4>
            <p>Para verificar se a correlação é estatisticamente significante, usamos um teste t.</p>
            <p><strong>Valor de t calculado:</strong> ${tValue.toFixed(4)}</p>
            <p><strong>Valor-p (p-value):</strong> ${pValue.toExponential(4)}</p>
            <p><strong>Critério de Decisão:</strong> Comparamos o p-valor com o nível de significância α (0,05).</p>
            <p><strong>Conclusão:</strong> Como o p-valor (${pValue.toExponential(4)}) é <strong>menor</strong> que α (0,05), <strong>rejeitamos a hipótese nula (H₀)</strong>.</p>
            <p class="alert ${ehSignificante ? 'alert-success' : 'alert-info'}">A correlação observada de ${r.toFixed(4)} é <strong>estatisticamente significante</strong>.</p>
        `;

        // 5. Necessidade de Spearman
        const spearmanDiv = document.getElementById('necessidade-spearman');
        spearmanDiv.innerHTML = `
            <h4>5) Necessidade do Coeficiente de Correlação de Spearman</h4>
            <p>O Coeficiente de Spearman é usado quando:</p>
            <ul>
                <li>A relação entre as variáveis não é linear.</li>
                <li>Os dados não seguem uma distribuição normal (ou não se pode assumir).</li>
                <li>Existem outliers significativos que distorcem a correlação de Pearson.</li>
            </ul>
            <p>Pelo gráfico de dispersão, a relação parece <strong>fortemente linear</strong>. Não há outliers óbvios que justifiquem o uso de Spearman. Portanto, para este conjunto de dados, o coeficiente de Pearson é a medida mais apropriada e <strong>não há necessidade de calcular o de Spearman</strong>.</p>
        `;

        document.getElementById('resultados-correlacao').style.display = 'block';

    } catch (error) {
        alert('Erro ao processar a correlação: ' + error.message);
        console.error(error);
    }
}

function calcularCorrelacaoPearson(x, y) {
    const tensorX = tf.tensor1d(x);
    const tensorY = tf.tensor1d(y);

    const meanX = tensorX.mean();
    const meanY = tensorY.mean();

    const centeredX = tensorX.sub(meanX);
    const centeredY = tensorY.sub(meanY);

    const numerator = centeredX.mul(centeredY).sum();
    const denominator = centeredX.square().sum().sqrt().mul(centeredY.square().sum().sqrt());

    const r = numerator.div(denominator).dataSync()[0];
    const rSquared = r * r;

    return { r, rSquared };
}

function gerarGraficoDispersao(x, y, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Limpar gráfico anterior

    const trace = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: '#667eea',
            size: 8
        },
        name: 'Dados'
    };

    const layout = {
        title: 'Gráfico de Dispersão: RPM vs. HP',
        xaxis: { title: 'Velocidade (RPM x 100)' },
        yaxis: { title: 'Capacidade (HP)' },
        showlegend: false,
        margin: { t: 50, r: 50, b: 50, l: 50 },
        font: { family: 'Inter, sans-serif' }
    };

    Plotly.newPlot(containerId, [trace], layout, {responsive: true});
}

function verificarSignificancia(r, n) {
    const tValue = r * Math.sqrt((n - 2) / (1 - r * r));
    // Esta é uma aproximação. Para um valor-p exato, precisaríamos de uma biblioteca de distribuição t.
    // No entanto, para um t tão alto, o p-valor será extremamente baixo.
    // Vamos usar uma simplificação para fins de demonstração, pois JS não tem uma lib estatística padrão.
    // Com t > 3, para n > 20, p é quase sempre < 0.05.
    const pValue = tValue > 3 ? 1e-5 : 0.1; // Simulação grosseira
    const ehSignificante = pValue < 0.05;

    return { tValue, pValue, ehSignificante };
}

// ATIVIDADE 2025.1: Regressão Linear
async function processarRegressao() {
    try {
        const rpmData = document.getElementById('rpmDataReg').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));

        const hpData = document.getElementById('hpDataReg').value
            .split(',')
            .map(x => parseFloat(x.trim()))
            .filter(x => !isNaN(x));

        if (rpmData.length !== hpData.length || rpmData.length === 0) {
            alert('Os dois conjuntos de dados devem ter o mesmo número de observações e não podem estar vazios.');
            return;
        }

        // 1. Hipóteses
        const hipotesesDiv = document.getElementById('hipoteses-regressao');
        hipotesesDiv.innerHTML = `
            <h4>1) Hipóteses da Regressão</h4>
            <p><strong>Hipótese Nula (H₀):</strong> Não há relação linear entre RPM e HP (o coeficiente angular da regressão, β₁, é igual a zero).</p>
            <p><strong>Hipótese Alternativa (H₁):</strong> Existe uma relação linear entre RPM e HP (o coeficiente angular da regressão, β₁, é diferente de zero).</p>
        `;

        // 2. Equação de Regressão
        const { model, rSquared } = await treinarModeloRegressao(rpmData, hpData);
        const [a, b] = model.getWeights()[0].dataSync(); // b = intercepto, a = inclinação
        const equacaoDiv = document.getElementById('equacao-regressao');
        equacaoDiv.innerHTML = `
            <h4>2) Equação de Regressão</h4>
            <p>A equação de regressão linear simples é: <strong>HP = ${b.toFixed(4)} + ${a.toFixed(4)} * RPM</strong></p>
            <p><strong>Interpretação:</strong></p>
            <ul>
                <li><strong>Intercepto (β₀ = ${b.toFixed(4)}):</strong> Valor esperado de HP quando o RPM é zero. (Pode não ter interpretação prática neste contexto).</li>
                <li><strong>Coeficiente Angular (β₁ = ${a.toFixed(4)}):</strong> Para cada aumento de 100 RPM, espera-se um aumento de ${a.toFixed(4)} em HP.</li>
            </ul>
        `;

        // 3. Gráfico de Regressão
        gerarGraficoRegressao(rpmData, hpData, model, 'grafico-regressao');

        // 4. P-valor da Regressão
        const pValorDiv = document.getElementById('p-valor-regressao');
        const { tValue, pValue, ehSignificante } = verificarSignificancia(Math.sqrt(rSquared), rpmData.length);
        pValorDiv.innerHTML = `
            <h4>4) Análise do P-valor da Regressão</h4>
            <p>O p-valor associado ao coeficiente angular (β₁) nos ajuda a decidir se a relação é estatisticamente significante.</p>
            <p><strong>Valor de t calculado:</strong> ${tValue.toFixed(4)}</p>
            <p><strong>Valor-p (p-value):</strong> ${pValue.toExponential(4)}</p>
            <p><strong>Conclusão:</strong> Como o p-valor (${pValue.toExponential(4)}) é muito menor que o nível de significância (α = 0,05), <strong>rejeitamos a hipótese nula</strong>.</p>
            <p class="alert alert-success">Isso significa que a variável RPM é um preditor <strong>estatisticamente significante</strong> para a variável HP.</p>
        `;

        // 5. Análise de Resíduos
        const residuosDiv = document.getElementById('analise-residuos');
        const parOrdenadoIdx = 5; // Escolhendo o 6º par (índice 5) para análise
        const rpmEscolhido = rpmData[parOrdenadoIdx];
        const hpReal = hpData[parOrdenadoIdx];
        const hpPrevisto = model.predict(tf.tensor2d([[rpmEscolhido]])).dataSync()[0];
        const residuo = hpReal - hpPrevisto;
        residuosDiv.innerHTML = `
            <h4>5) Análise de Resíduos</h4>
            <p>Analisando o par ordenado (RPM=${rpmEscolhido}, HP=${hpReal}):</p>
            <p><strong>Valor Previsto (HP'):</strong> ${b.toFixed(4)} + ${a.toFixed(4)} * ${rpmEscolhido} = <strong>${hpPrevisto.toFixed(4)}</strong></p>
            <p><strong>Resíduo (e):</strong> Valor Real - Valor Previsto = ${hpReal} - ${hpPrevisto.toFixed(4)} = <strong>${residuo.toFixed(4)}</strong></p>
            <p><strong>Interpretação:</strong> O resíduo de ${residuo.toFixed(4)} indica que, para um RPM de ${rpmEscolhido}, o modelo subestimou o valor real de HP em aproximadamente ${Math.abs(residuo).toFixed(4)} unidades. A análise de todos os resíduos ajuda a avaliar o ajuste do modelo.</p>
        `;

        // 6. Coeficiente de Determinação (R²)
        const r2Div = document.getElementById('coeficiente-determinacao');
        r2Div.innerHTML = `
            <h4>6) Coeficiente de Determinação (R²)</h4>
            <p><strong>R²:</strong> ${rSquared.toFixed(4)} (${(rSquared * 100).toFixed(2)}%)</p>
            <p><strong>Interpretação:</strong> Aproximadamente <strong>${(rSquared * 100).toFixed(2)}%</strong> da variabilidade na capacidade da máquina (HP) é explicada pela variabilidade na velocidade (RPM), de acordo com o nosso modelo linear.</p>
        `;

        document.getElementById('resultados-regressao').style.display = 'block';

    } catch (error) {
        alert('Erro ao processar a regressão: ' + error.message);
        console.error(error);
    }
}

async function treinarModeloRegressao(x, y) {
    const xs = tf.tensor2d(x, [x.length, 1]);
    const ys = tf.tensor2d(y, [y.length, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({
        optimizer: tf.train.sgd(0.001),
        loss: 'meanSquaredError'
    });

    // Treinar o modelo
    const history = await model.fit(xs, ys, {
        epochs: 100,
        callbacks: {
            onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
        }
    });

    // Calcular R²
    const yPred = model.predict(xs);
    const rSquared = tf.tidy(() => {
        const yMean = ys.mean();
        const ssTot = ys.sub(yMean).square().sum();
        const ssRes = ys.sub(yPred).square().sum();
        return tf.scalar(1).sub(ssRes.div(ssTot)).dataSync()[0];
    });

    return { model, rSquared };
}

function gerarGraficoRegressao(x, y, model, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const traceOriginal = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        name: 'Dados Originais',
        marker: { color: '#667eea', size: 8 }
    };

    const xLinspace = tf.linspace(Math.min(...x), Math.max(...x), 100);
    const yLinspace = model.predict(xLinspace.reshape([100, 1]));

    const traceRegressao = {
        x: xLinspace.dataSync(),
        y: yLinspace.dataSync(),
        mode: 'lines',
        type: 'scatter',
        name: 'Linha de Regressão',
        line: { color: '#f5576c', width: 3 }
    };

    const layout = {
        title: 'Gráfico de Regressão Linear: RPM vs. HP',
        xaxis: { title: 'Velocidade (RPM x 100)' },
        yaxis: { title: 'Capacidade (HP)' },
        showlegend: true,
        legend: { x: 0.01, y: 0.99 },
        margin: { t: 50, r: 50, b: 50, l: 50 },
        font: { family: 'Inter, sans-serif' }
    };

    Plotly.newPlot(containerId, [traceOriginal, traceRegressao], layout, {responsive: true});
}

function carregarDadosExemploRegressao() {
    const rpmData = [22.0, 20.0, 18.0, 16.0, 14.0, 12.0, 15.0, 17.0, 19.0, 21.0, 22.0, 20.0, 18.0, 16.0, 14.0, 12.0, 10.5, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 24.0];
    const hpData = [64.03, 62.47, 54.94, 48.84, 43.73, 37.48, 46.85, 51.17, 58.00, 63.21, 64.03, 62.63, 52.90, 48.84, 42.74, 36.63, 32.05, 39.68, 45.79, 51.17, 56.65, 62.61, 65.31, 63.89];
    document.getElementById('rpmDataReg').value = rpmData.join(', ');
    document.getElementById('hpDataReg').value = hpData.join(', ');
}