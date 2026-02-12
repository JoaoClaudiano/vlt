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
const slider = document.getElementById('time-slider');
const display = document.getElementById('time-display');
const btn = document.getElementById('toggle-sim');

// Converte minutos totais para HH:mm
function formatarHora(minutos) {
    const h = Math.floor(minutos / 60).toString().padStart(2, '0');
    const m = (minutos % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

// Intercepta o horário para o script principal
export function getHorarioSimulado() {
    if (!simulacaoAtiva) return null; // Retorna null para usar a hora real
    return formatarHora(slider.value);
}

slider.addEventListener('input', () => {
    display.innerText = formatarHora(slider.value);
    if (simulacaoAtiva) atualizarMapa();
});

btn.addEventListener('click', () => {
    simulacaoAtiva = !simulacaoAtiva;
    btn.innerText = simulacaoAtiva ? "Desativar (Usar Hora Real)" : "Ativar Simulação";
    btn.style.background = simulacaoAtiva ? "#ffcccc" : "#ccffcc";
    atualizarMapa();
});
