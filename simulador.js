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
