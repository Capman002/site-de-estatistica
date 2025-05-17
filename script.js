// Dados exemplo pré-carregados
const dadosExemplo = {
    maquinaA: [88.24, 87.58, 87.99, 87.89, 88.04, 88.14, 88.10, 88.07, 87.83, 87.77, 87.85, 88.19, 88.39, 87.90, 87.69, 88.18, 87.96, 87.96, 87.93, 88.26, 87.72, 87.59, 88.09, 88.30, 88.12, 88.22, 87.82, 88.01, 88.03, 88.09],
    maquinaB: [87.80, 88.13, 88.22, 88.15, 88.08, 88.30, 88.14, 88.25, 88.09, 88.03, 88.18, 87.79, 87.82, 88.04, 88.19, 88.18, 87.92, 88.06, 88.28, 88.04, 88.14, 87.70, 88.30, 87.91, 88.14, 87.98, 87.63, 87.95, 88.14, 87.96],
    temposFalha: [129, 124, 121, 123, 127, 136, 134, 130, 130, 129, 125, 123, 136, 131, 124, 123, 129, 133, 133, 125, 131, 120, 137, 125, 132, 120, 130, 125, 125, 131, 124, 119, 125, 133, 124, 136, 128, 133, 133, 136, 130, 128, 124, 141, 131, 128, 129, 129, 129, 130, 136, 133, 128, 125, 141, 133, 128, 125, 125, 139, 128, 129, 129, 129, 138, 137, 129, 129, 129, 128, 129, 124, 130, 131, 129, 136, 131, 131, 131, 129, 121, 142, 122, 129, 121, 142, 136, 129, 129, 121, 128, 135, 140, 126, 125, 121, 129, 126, 126, 128]
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
    
    // Adicionar classe active ao botão
    event.target.classList.add('active');
}

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
});