/* ============================================ */
/* ПАСХАЛКА: набери "monika" или "miku"          */
/* (на клавиатуре или в консоли F12)             */
/* ============================================ */
(function mikuEasterEgg() {
    'use strict';

    let buffer = '';
    const SECRETS = ['monika', 'miku'];
    const MAX_LEN = 6;

    document.addEventListener('keydown', function (e) {
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (e.key.length !== 1) return;

        buffer += e.key.toLowerCase();
        buffer = buffer.slice(-MAX_LEN);

        if (SECRETS.some(s => buffer.endsWith(s))) {
            buffer = '';
            spawnMiku();
        }
    });

    // Вызов из консоли: monika() или miku()
    window.monika = spawnMiku;
    window.miku = spawnMiku;

    function spawnMiku() {
        if (document.getElementById('miku-overlay')) return;

        if (!document.getElementById('miku-styles')) {
            const style = document.createElement('style');
            style.id = 'miku-styles';
            style.textContent = `
                #miku-overlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 99999;
                    overflow: hidden;
                }
                .miku-figure {
                    position: absolute;
                    bottom: -10vh;
                    font-size: 64px;
                    animation: miku-sway 2.2s ease-in-out infinite alternate;
                    filter: drop-shadow(0 0 12px rgba(57,197,187,.9));
                    will-change: transform;
                }
                @keyframes miku-sway {
                    from { transform: translateX(0) rotate(-6deg); }
                    to   { transform: translateX(14px) rotate(6deg); }
                }
                #miku-message {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(.6);
                    background: linear-gradient(135deg, #39c5bb, #2a9d94);
                    color: #fff;
                    padding: 28px 42px;
                    border-radius: 18px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    font-size: 26px;
                    font-weight: 700;
                    text-align: center;
                    box-shadow: 0 0 40px rgba(57,197,187,.85);
                    opacity: 0;
                    transition: all .5s cubic-bezier(.34,1.56,.64,1);
                    pointer-events: auto;
                    z-index: 100000;
                    max-width: 90vw;
                    border: 3px solid #fff;
                }
                #miku-message.show {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                #miku-message small {
                    display: block;
                    margin-top: 10px;
                    font-weight: 400;
                    font-size: 15px;
                    opacity: .9;
                }
                #miku-message button {
                    margin-top: 16px;
                    background: #fff;
                    color: #2a9d94;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 30px;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    transition: transform .2s;
                }
                #miku-message button:hover {
                    transform: scale(1.08);
                }
                .miku-note {
                    position: absolute;
                    font-size: 30px;
                    animation: miku-float 4s linear forwards;
                    opacity: 0;
                }
                @keyframes miku-float {
                    0%   { opacity: 0; transform: translateY(0) scale(.6); }
                    15%  { opacity: 1; }
                    100% { opacity: 0; transform: translateY(-90vh) scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }

        const overlay = document.createElement('div');
        overlay.id = 'miku-overlay';
        document.body.appendChild(overlay);

        const mikus = ['🎤', '🎶', '💚', '🎵'];
        for (let i = 0; i < 6; i++) {
            const m = document.createElement('div');
            m.className = 'miku-figure';
            m.textContent = mikus[i % mikus.length];
            m.style.left = (5 + Math.random() * 85) + 'vw';
            m.style.animationDelay = (Math.random() * 1.5) + 's';
            m.style.fontSize = (40 + Math.random() * 50) + 'px';
            overlay.appendChild(m);
        }

        const notes = ['♪', '♫', '🎵', '💚', '🎤'];
        const noteInterval = setInterval(() => {
            if (!document.getElementById('miku-overlay')) {
                clearInterval(noteInterval);
                return;
            }
            const n = document.createElement('div');
            n.className = 'miku-note';
            n.textContent = notes[Math.floor(Math.random() * notes.length)];
            n.style.left = Math.random() * 100 + 'vw';
            n.style.top = '85vh';
            n.style.color = '#39c5bb';
            overlay.appendChild(n);
            setTimeout(() => n.remove(), 4200);
        }, 220);

        const msg = document.createElement('div');
        msg.id = 'miku-message';
        msg.innerHTML = `
            💚 Мику Хацунэ приветствует тебя! 💚
            <small>Ты нашёл пасхалку! みくみくにしてあげる♪</small>
            <button id="miku-close">Закрыть</button>
        `;
        document.body.appendChild(msg);
        requestAnimationFrame(() => msg.classList.add('show'));

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                const melody = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25];
                melody.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
                    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + i * 0.18 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.16);
                    osc.connect(gain).connect(ctx.destination);
                    osc.start(ctx.currentTime + i * 0.18);
                    osc.stop(ctx.currentTime + i * 0.18 + 0.18);
                });
            }
        } catch (err) { /* автоплей может быть заблокирован — не страшно */ }

        const close = () => {
            msg.classList.remove('show');
            setTimeout(() => {
                msg.remove();
                overlay.remove();
                clearInterval(noteInterval);
            }, 500);
        };
        document.getElementById('miku-close').addEventListener('click', close);
        msg.addEventListener('click', (e) => { if (e.target === msg) close(); });
        setTimeout(() => { if (document.getElementById('miku-overlay')) close(); }, 12000);

        console.log('%c💚 Мику Хацунэ: みくみくにしてあげる♪', 'color:#39c5bb;font-size:16px;font-weight:bold;');
    }
})();