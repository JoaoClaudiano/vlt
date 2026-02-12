import { vltData } from './data.js';
import { initSimulador, getTempoAtualSegundos } from './simulador.js';

// Inicialização do Mapa
const map = L.map('map').setView([-3.7432, -38.5144], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Desenha Estações Fixas
Object.entries(vltData.estacoes).forEach(([nome, coords]) => {
    L.circleMarker([coords.lat, coords.lng], {
        radius: 4, color: '#333', fillColor: '#fff', fillOpacity: 1, weight: 2
    }).addTo(map).bindTooltip(nome);
});

let trainMarkers = [];

// Auxiliar: Converte "HH:mm" para Segundos totais
const hParaS = (hStr) => {
    const [h, m] = hStr.split(':').map(Number);
    return (h * 3600) + (m * 60);
};

export function atualizarMapa() {
    trainMarkers.forEach(m => map.removeLayer(m));
    trainMarkers = [];

    const segundosAgora = getTempoAtualSegundos();

    processarSentido(vltData.horariosIate, vltData.sequenciaIate, "Iate", segundosAgora);
    processarSentido(vltData.horariosParangaba, vltData.sequenciaParangaba, "Parangaba", segundosAgora);
}

function processarSentido(grade, sequencia, nomeSentido, segundosAgora) {
    grade.forEach(viagem => {
        const inicioS = hParaS(viagem[0]);
        const fimS = hParaS(viagem[viagem.length - 1]);

        if (segundosAgora >= inicioS && segundosAgora <= fimS) {
            for (let i = 0; i < viagem.length - 1; i++) {
                const s1 = hParaS(viagem[i]);
                const s2 = hParaS(viagem[i+1]);

                if (segundosAgora >= s1 && segundosAgora < s2) {
                    // Interpolação precisa por segundos
                    const progresso = (segundosAgora - s1) / (s2 - s1);
                    desenharTrem(sequencia[i], sequencia[i+1], progresso, nomeSentido);
                }
            }
        }
    });
}

function desenharTrem(est1, est2, progresso, sentido) {
    const c1 = vltData.estacoes[est1];
    const c2 = vltData.estacoes[est2];

    const lat = c1.lat + (c2.lat - c1.lat) * progresso;
    const lng = c1.lng + (c2.lng - c1.lng) * progresso;

    const icon = L.divIcon({
        className: `train-ping ${sentido === 'Iate' ? 'ping-iate' : 'ping-parangaba'}`,
        iconSize: [12, 12]
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    marker.bindPopup(`<b>VLT Sentido ${sentido}</b><br>Próxima: ${est2}`);
    trainMarkers.push(marker);
}

// Inicializa Simulador e Loop de 1 segundo para suavidade
initSimulador(atualizarMapa);
setInterval(atualizarMapa, 1000); 
atualizarMapa();
