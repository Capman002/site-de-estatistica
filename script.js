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

const dadosCorrelacaoExemplo = {
    x: [22.0, 20.0, 18.0, 16.0, 14.0, 12.0, 15.0, 17.0, 19.0, 21.0, 22.0, 20.0, 18.0, 16.0, 14.0, 12.0, 10.5, 13.0, 15.0, 17.0, 19.0, 21.0, 23.0, 24.0],
    y: [64.03, 62.47, 54.94, 48.84, 43.73, 37.48, 46.85, 51.17, 58.00, 63.21, 64.03, 62.63, 52.90, 48.84, 42.74, 36.63, 32.05, 39.68, 45.79, 51.17, 56.65, 62.61, 65.31, 63.89]
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
    // Processar a análise de correlação automaticamente
    processarCorrelacao();
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

// ATIVIDADE 5: Correlação Linear
function processarCorrelacao() {
    try {
        const x = dadosCorrelacaoExemplo.x;
        const y = dadosCorrelacaoExemplo.y;

        // Usar TensorFlow.js para cálculos
        const xTensor = tf.tensor1d(x);
        const yTensor = tf.tensor1d(y);

        const meanX = tf.mean(xTensor).dataSync()[0];
        const meanY = tf.mean(yTensor).dataSync()[0];

        const pearsonR = tf.sum(tf.mul(tf.sub(xTensor, meanX), tf.sub(yTensor, meanY))).div(
            tf.sqrt(tf.sum(tf.square(tf.sub(xTensor, meanX)))).mul(tf.sqrt(tf.sum(tf.square(tf.sub(yTensor, meanY)))))
        ).dataSync()[0];

        // Exibir resultados
        document.getElementById('resultados-correlacao').style.display = 'block';
        exibirVariaveis();
        exibirHipoteses();
        criarGraficoDispersao(x, y);
        exibirCoeficientePearson(pearsonR);
        exibirSignificancia(pearsonR, x.length);
        exibirAnaliseSpearman();

    } catch (error) {
        alert('Erro ao processar dados: ' + error.message);
    }
}

function exibirVariaveis() {
    document.getElementById('variaveis-correlacao').innerHTML = `
        <h4>1) Variáveis</h4>
        <p><strong>Variável Independente (X):</strong> Velocidade (rpm × 100)</p>
        <p><strong>Variável Dependente (Y):</strong> Capacidade (HP)</p>
    `;
}

function exibirHipoteses() {
    document.getElementById('hipoteses-correlacao').innerHTML = `
        <h4>2) Hipóteses de Associação</h4>
        <p><strong>Hipótese Nula (H₀):</strong> Não existe correlação linear entre a velocidade e a capacidade da máquina (ρ = 0).</p>
        <p><strong>Hipótese Alternativa (H₁):</strong> Existe correlação linear entre a velocidade e a capacidade da máquina (ρ ≠ 0).</p>
    `;
}

function criarGraficoDispersao(x, y) {
    const trace = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        marker: { color: '#667eea' }
    };

    const layout = {
        title: 'Gráfico de Dispersão: Velocidade vs. Capacidade',
        xaxis: { title: 'Velocidade (rpm × 100)' },
        yaxis: { title: 'Capacidade (HP)' }
    };

    Plotly.newPlot('grafico-dispersao-correlacao', [trace], layout);
}

function exibirCoeficientePearson(r) {
    let grau = '';
    if (Math.abs(r) >= 0.9) grau = 'Fortíssima';
    else if (Math.abs(r) >= 0.7) grau = 'Forte';
    else if (Math.abs(r) >= 0.5) grau = 'Moderada';
    else if (Math.abs(r) >= 0.3) grau = 'Fraca';
    else grau = 'Muito Fraca';

    document.getElementById('coeficiente-pearson-correlacao').innerHTML = `
        <h4>3) Coeficiente de Correlação de Pearson (r)</h4>
        <p><strong>Valor de r:</strong> ${r.toFixed(4)}</p>
        <p><strong>Grau de Associação:</strong> ${grau}</p>
        <p>Indica uma correlação linear positiva ${grau.toLowerCase()}.</p>
    `;
}

function exibirSignificancia(r, n) {
    const t = r * Math.sqrt((n - 2) / (1 - r * r));
    const pValor = 2 * (1 - tDist(Math.abs(t), n - 2)); // Two-tailed test

    let resultado = '';
    if (pValor < 0.05) {
        resultado = '<strong style="color: green;">Rejeita-se H₀.</strong> A correlação é estatisticamente significante.';
    } else {
        resultado = '<strong style="color: red;">Não se rejeita H₀.</strong> A correlação não é estatisticamente significante.';
    }

    document.getElementById('significancia-correlacao').innerHTML = `
        <h4>4) Significância Estatística (α = 0,05)</h4>
        <p><strong>Estatística t:</strong> ${t.toFixed(4)}</p>
        <p><strong>P-valor:</strong> ${pValor.toFixed(4)}</p>
        <p>${resultado}</p>
    `;
}

function exibirAnaliseSpearman() {
    document.getElementById('coeficiente-spearman-correlacao').innerHTML = `
        <h4>5) Coeficiente de Correlação de Spearman</h4>
        <p>O Coeficiente de Spearman seria necessário se a relação entre as variáveis não fosse linear ou se os dados contivessem outliers significativos. Dado o gráfico de dispersão e o alto valor de r de Pearson, a correlação linear parece apropriada e o cálculo de Spearman não é estritamente necessário, mas poderia confirmar a força da relação monotônica.</p>
    `;
}

// Approximation of T-distribution CDF
function tDist(t, df) {
    // A simple approximation for the CDF of the t-distribution
    let a = df / 2;
    let x = t * t / (t * t + df);

    function betaInc(x, a, b) {
        // Incomplete beta function - using a simplified approximation
        if (x === 0) return 0;
        if (x === 1) return 1;

        let bt = Math.exp(gammaLn(a + b) - gammaLn(a) - gammaLn(b) + a * Math.log(x) + b * Math.log(1 - x));
        if (x < (a + 1) / (a + b + 2)) {
            return bt * betacf(x, a, b) / a;
        } else {
            return 1 - bt * betacf(1 - x, b, a) / b;
        }
    }

    function betacf(x, a, b) {
        let MAXIT = 100;
        let EPS = 3.0e-7;
        let FPMIN = 1.0e-30;

        let qab = a + b;
        let qap = a + 1;
        let qam = a - 1;

        let c = 1;
        let d = 1 - qab * x / qap;
        if (Math.abs(d) < FPMIN) d = FPMIN;
        d = 1 / d;
        let h = d;

        for (let m = 1; m <= MAXIT; m++) {
            let m2 = 2 * m;
            let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
            d = 1 + aa * d;
            if (Math.abs(d) < FPMIN) d = FPMIN;
            c = 1 + aa / c;
            if (Math.abs(c) < FPMIN) c = FPMIN;
            d = 1 / d;
            h *= (d * c);
            aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
            d = 1 + aa * d;
            if (Math.abs(d) < FPMIN) d = FPMIN;
            c = 1 + aa / c;
            if (Math.abs(c) < FPMIN) c = FPMIN;
            d = 1 / d;
            let del = h * (d * c);
            h = del;
            if (Math.abs(del - 1.0) < EPS) break;
        }
        return h;
    }

    function gammaLn(xx) {
        let cof = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
        let x = xx;
        let y = x;
        let tmp = x + 5.5;
        tmp -= (x + 0.5) * Math.log(tmp);
        let ser = 1.000000000190015;
        for (let j = 0; j < 6; j++) ser += cof[j] / ++y;
        return -tmp + Math.log(2.5066282746310005 * ser / x);
    }

    return 1 - 0.5 * betaInc(x, a, 0.5);
}

// Garantir que a função esteja acessível globalmente se não estiver usando módulos
window.processarAnaliseMaquinas = processarAnaliseMaquinas;