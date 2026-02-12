import { vltData } from './data.js';

// Inicializa o mapa centralizado em Fortaleza
const map = L.map('map').setView([-3.7432, -38.5144], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const trainMarkers = [];

function hParaM(horaStr) {
    const [h, m] = horaStr.split(':').map(Number);
    return h * 60 + m;
}

function atualizarPosicoes() {
    const agora = new Date();
    const minAgora = agora.getHours() * 60 + agora.getMinutes();
    
    // Limpa trens antigos do mapa
    trainMarkers.forEach(m => map.removeLayer(m));
    
    const estacoesLista = Object.keys(vltData.estacoes);
    
    // Checar sentido Iate [cite: 4]
    vltData.horariosIate.forEach(viagem => {
        const inicio = hParaM(viagem[0]);
        const fim = hParaM(viagem[10]);

        if (minAgora >= inicio && minAgora <= fim) {
            for (let i = 0; i < viagem.length - 1; i++) {
                const partida = hParaM(viagem[i]);
                const chegada = hParaM(viagem[i+1]);

                if (minAgora >= partida && minAgora < chegada) {
                    const progresso = (minAgora - partida) / (chegada - partida);
                    desenharTrem(estacoesLista[i], estacoesLista[i+1], progresso, "Iate");
                }
            }
        }
    });
}

function desenharTrem(est1, est2, progresso, sentido) {
    const coord1 = vltData.estacoes[est1];
    const coord2 = vltData.estacoes[est2];

    // Interpolação linear da posição
    const lat = coord1.lat + (coord2.lat - coord1.lat) * progresso;
    const lng = coord1.lng + (coord2.lng - coord1.lng) * progresso;

    const marker = L.circleMarker([lat, lng], {
        color: sentido === 'Iate' ? 'blue' : 'green',
        radius: 8,
        fillOpacity: 0.8
    }).addTo(map).bindPopup(`Trem sentido ${sentido}<br>Próxima: ${est2}`);
    
    trainMarkers.push(marker);
    document.getElementById('info').innerHTML = `Trem detectado em direção ao <b>${sentido}</b>.`;
}

// Atualiza a cada 30 segundos
setInterval(atualizarPosicoes, 30000);
atualizarPosicoes();
