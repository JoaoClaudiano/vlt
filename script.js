import { vltData } from './data.js';

// 1. Configuração Inicial do Mapa
const map = L.map('map').setView([-3.7432, -38.5144], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);
//
let trainMarkers = [];

// Auxiliar: Converte "HH:mm" para minutos totais do dia
const hParaM = (hStr) => {
    const [h, m] = hStr.split(':').map(Number);
    return h * 60 + m;
};

// 2. Função de Processamento de Viagem
function processarTrens(horarios, sequencia, sentido) {
    const agora = new Date();
    // Use uma hora fixa para teste se quiser ver funcionando fora do horário comercial:
    // const minAgora = hParaM("08:10"); 
    const minAgora = agora.getHours() * 60 + agora.getMinutes();
    
    horarios.forEach((viagem) => {
        const inicioViagem = hParaM(viagem[0]);
        const fimViagem = hParaM(viagem[viagem.length - 1]);

        // Verifica se há um trem nesta viagem circulando agora
        if (minAgora >= inicioViagem && minAgora <= fimViagem) {
            for (let i = 0; i < viagem.length - 1; i++) {
                const partida = hParaM(viagem[i]);
                const chegada = hParaM(viagem[i+1]);

                if (minAgora >= partida && minAgora < chegada) {
                    const progresso = (minAgora - partida) / (chegada - partida);
                    renderizarTremNoMapa(sequencia[i], sequencia[i+1], progresso, sentido, viagem[i+1]);
                }
            }
        }
    });
}

// 3. Desenha o ícone no mapa com interpolação
function renderizarTremNoMapa(est1, est2, progresso, sentido, proxHora) {
    const c1 = vltData.estacoes[est1];
    const c2 = vltData.estacoes[est2];

    const lat = c1.lat + (c2.lat - c1.lat) * progresso;
    const lng = c1.lng + (c2.lng - c1.lng) * progresso;

    const marker = L.circleMarker([lat, lng], {
        color: sentido === 'Iate' ? 'blue' : 'green',
        fillColor: sentido === 'Iate' ? '#30f' : '#0a0',
        fillOpacity: 1,
        radius: 9
    }).addTo(map);

    marker.bindPopup(`<b>VLT - Sentido ${sentido}</b><br>Próxima parada: ${est2} às ${proxHora}`);
    trainMarkers.push(marker);
}

// 4. Loop de Atualização
function atualizarMapa() {
    // Remove marcadores anteriores
    trainMarkers.forEach(m => map.removeLayer(m));
    trainMarkers = [];

    // Processa os dois sentidos do PDF [cite: 4, 8]
    processarTrens(vltData.horariosIate, vltData.sequenciaIate, "Iate");
    processarTrens(vltData.horariosParangaba, vltData.sequenciaParangaba, "Parangaba");

    const statusDiv = document.getElementById('status');
    if (trainMarkers.length === 0) {
        statusDiv.innerHTML = "Nenhum trem em operação agora.";
    } else {
        statusDiv.innerHTML = `${trainMarkers.length} trem(ns) detectado(s).`;
    }
}

// Inicia o sistema
atualizarMapa();
setInterval(atualizarMapa, 30000); // Atualiza a cada 30 segundos
