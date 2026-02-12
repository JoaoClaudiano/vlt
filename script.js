import { vltData } from './data.js';

const map = L.map('map').setView([-3.7432, -38.5144], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 1. Desenhar Estações Fixas (Pins Cinzas)
Object.entries(vltData.estacoes).forEach(([nome, coords]) => {
    L.circleMarker([coords.lat, coords.lng], {
        radius: 5,
        color: '#666',
        fillColor: '#fff',
        fillOpacity: 1,
        weight: 2
    }).addTo(map).bindTooltip(nome, { permanent: false, direction: 'top' });
});

let trainMarkers = [];

const hParaM = (hStr) => {
    const [h, m] = hStr.split(':').map(Number);
    return h * 60 + m;
};

function atualizarMapa() {
    trainMarkers.forEach(m => map.removeLayer(m));
    trainMarkers = [];

    // Para teste rápido fora de horário, você pode descomentar a linha abaixo:
    // const minAgora = hParaM("08:10"); 
    const agora = new Date();
    const minAgora = agora.getHours() * 60 + agora.getMinutes();

    // Processar os dois sentidos
    processarSentido(vltData.horariosIate, vltData.sequenciaIate, "Iate");
    processarSentido(vltData.horariosParangaba, vltData.sequenciaParangaba, "Parangaba");
}

function processarSentido(grade, sequencia, nomeSentido) {
    grade.forEach(viagem => {
        const inicio = hParaM(viagem[0]);
        const fim = hParaM(viagem[10]);

        if (minAgora >= inicio && minAgora <= fim) {
            for (let i = 0; i < viagem.length - 1; i++) {
                const p1 = hParaM(viagem[i]);
                const p2 = hParaM(viagem[i+1]);

                if (minAgora >= p1 && minAgora < p2) {
                    const progresso = (minAgora - p1) / (p2 - p1);
                    criarMarcadorPulsante(sequencia[i], sequencia[i+1], progresso, nomeSentido);
                }
            }
        }
    });
}

function criarMarcadorPulsante(est1, est2, progresso, sentido) {
    const c1 = vltData.estacoes[est1];
    const c2 = vltData.estacoes[est2];

    // Cálculo da posição exata entre as estações
    const lat = c1.lat + (c2.lat - c1.lat) * progresso;
    const lng = c1.lng + (c2.lng - c1.lng) * progresso;

    // Ícone customizado com a classe CSS de pulsação
    const pingIcon = L.divIcon({
        className: `train-ping ${sentido === 'Iate' ? 'ping-iate' : 'ping-parangaba'}`,
        iconSize: [12, 12]
    });

    const marker = L.marker([lat, lng], { icon: pingIcon }).addTo(map);
    marker.bindPopup(`<b>VLT Sentido ${sentido}</b><br>Entre ${est1} e ${est2}`);
    
    trainMarkers.push(marker);
}

// Atualização minuto a minuto
setInterval(atualizarMapa, 60000); 
atualizarMapa();
