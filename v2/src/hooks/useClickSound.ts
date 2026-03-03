/**
 * useClickSound
 * Reproduz um som suave de "clique" em toda interação de click/tap.
 * Utiliza Web Audio API — sem arquivos externos necessários.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    return audioCtx;
}

export function playClickSound() {
    try {
        const ctx = getAudioContext();

        // Desbloqueia o contexto em caso de estado suspenso (política de autoplay)
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Tom suave de clique: onda senoidal de curta duração
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06);

        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
    } catch {
        // Ignora erros silenciosamente (ex: navegadores sem suporte)
    }
}

/**
 * Registra o som de clique globalmente no document.
 * Filtra apenas elementos interativos para evitar sons indesejados.
 */
export function initGlobalClickSound() {
    const INTERACTIVE_TAGS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL', 'SUMMARY']);

    function isInteractive(el: EventTarget | null): boolean {
        if (!(el instanceof Element)) return false;
        let node: Element | null = el;
        while (node) {
            const tag = node.tagName;
            if (INTERACTIVE_TAGS.has(tag)) return true;
            if (
                node.getAttribute('role') === 'button' ||
                node.getAttribute('role') === 'tab' ||
                node.getAttribute('role') === 'menuitem' ||
                node.getAttribute('role') === 'option' ||
                node.getAttribute('tabindex') !== null ||
                node.classList.contains('btn') ||
                node.classList.contains('clickable')
            ) {
                return true;
            }
            node = node.parentElement;
        }
        return false;
    }

    document.addEventListener('click', (e) => {
        if (isInteractive(e.target)) {
            playClickSound();
        }
    });
}
