import { atualizarMapa } from './script.js';

// Criar interface do simulador no HTML
const simHTML = `
    <div id="sim-control" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 2000; background: white; padding: 15px; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.3); width: 300px;">
        <label style="display:block; margin-bottom:5px; font-weight:bold;">Simulador de Horário</label>
        <input type="range" id="time-slider" min="300" max="1400" value="480" style="width: 100%;">
        <div id="time-display" style="text-align:center; font-size: 1.2em; margin-top:5px;">08:00</div>
        <button id="toggle-sim" style="width:100%; margin-top:10px; cursor:pointer;">Ativar Simulação</button>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', simHTML);

let simulacaoAtiva = false;
let tempoSimuladoEmSegundos = 28800; // Começa às 08:00 (8 * 3600)

export function getTempoAtualSegundos() {
    if (!simulacaoAtiva) {
        const agora = new Date();
        return (agora.getHours() * 3600) + (agora.getMinutes() * 60) + agora.getSeconds();
    }
    return tempoSimuladoEmSegundos;
}

export function initSimulador(callbackAtualizar) {
    const simHTML = `
        <div id="sim-control">
            <label><b>Simulador de Tempo</b></label>
            <input type="range" id="time-slider" min="19800" max="84600" value="28800" style="width: 100%;">
            <div id="time-display" style="font-size: 1.5em; font-weight: bold; color: #333;">08:00:00</div>
            <button id="toggle-sim" style="width:100%; margin-top:10px; padding: 5px; cursor:pointer;">Ativar Simulação</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', simHTML);

    const slider = document.getElementById('time-slider');
    const display = document.getElementById('time-display');
    const btn = document.getElementById('toggle-sim');

    const formatarTempo = (totalSeg) => {
        const h = Math.floor(totalSeg / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeg % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeg % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    slider.addEventListener('input', () => {
        tempoSimuladoEmSegundos = parseInt(slider.value);
        display.innerText = formatarTempo(tempoSimuladoEmSegundos);
        callbackAtualizar();
    });

    btn.addEventListener('click', () => {
        simulacaoAtiva = !simulacaoAtiva;
        btn.innerText = simulacaoAtiva ? "Usar Hora Real" : "Ativar Simulação";
        btn.style.background = simulacaoAtiva ? "#ffebee" : "#e8f5e9";
        callbackAtualizar();
    });
}
