<!-- === ПАСХАЛКА: набери "monika" или "miku" (или вызови monika() / miku() в консоли) === -->
<script>
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

    window.monika = spawnMiku;
    window.miku = spawnMiku;

    function spawnMiku() {
        if (document.getElementById('miku-fullscreen')) return;

        if (!document.getElementById('miku-styles')) {
            const style = document.createElement('style');
            style.id = 'miku-styles';
            style.textContent = `
                #miku-fullscreen {
                    position: fixed;
                    inset: 0;
                    z-index: 999999;
                    background-color: rgba(0, 0, 0, 0.75); /* Затемнение фона */
                    backdrop-filter: blur(4px); /* Легкое размытие сайта на фоне */
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                    pointer-events: none;
                }
                #miku-fullscreen.show {
                    opacity: 1;
                    pointer-events: auto; /* Блокируем клики по сайту, пока танцует Мику */
                }
                
                /* Контейнер для гифки, чтобы она не растягивалась на весь экран, а была по центру */
                .miku-dance-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    max-width: 90vw;
                    max-height: 80vh;
                }

                /* Сама гифка */
                #miku-gif {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 16px;
                    box-shadow: 0 0 40px rgba(57, 197, 187, 0.6); /* Свечение вокруг Мику */
                    animation: miku-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                /* Текст под гифкой */
                #miku-text {
                    margin-top: 20px;
                    background: linear-gradient(135deg, #39c5bb, #2a9d94);
                    color: #fff;
                    padding: 12px 28px;
                    border-radius: 30px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    font-size: 22px;
                    font-weight: bold;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    border: 3px solid #fff;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                    pointer-events: none;
                    white-space: nowrap;
                    animation: miku-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s backwards;
                }

                @keyframes miku-pop {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // === Создаём контейнер ===
        const overlay = document.createElement('div');
        overlay.id = 'miku-fullscreen';

        // === Контейнер для гифки ===
        const gifContainer = document.createElement('div');
        gifContainer.className = 'miku-dance-container';

        // === Вставляем гифку ===
        // ВАЖНО: Замени 'miku-dance.gif' на имя твоего файла с гифкой.
        // Файл должен лежать в той же папке, что и index.html
        const img = document.createElement('img');
        img.id = 'miku-gif';
        img.src = 'miku-dance.gif'; 
        img.alt = 'Miku Dancing';
        
        // Если гифки нет, покажем заглушку
        img.onerror = function() {
            img.style.display = 'none';
            const fallback = document.createElement('h1');
            fallback.textContent = '💃 Мику танцует! 💃';
            fallback.style.color = '#fff';
            fallback.style.fontSize = '3rem';
            gifContainer.appendChild(fallback);
        };

        // === Текст ===
        const textBox = document.createElement('div');
        textBox.id = 'miku-text';
        textBox.textContent = '💚 Мику Хацунэ: みくみくにしてあげる♪';

        gifContainer.appendChild(img);
        overlay.appendChild(gifContainer);
        overlay.appendChild(textBox);
        document.body.appendChild(overlay);

        // === Запускаем анимацию появления ===
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });

        // === Звук (Web Audio API) ===
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
        } catch (err) { /* Игнорируем ошибки автоплея */ }

        // === Автоматическое закрытие через 6 секунд ===
        setTimeout(() => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 600);
        }, 6000); 

        // === Возможность закрыть кликом ===
        overlay.addEventListener('click', () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 600);
        });

        console.log('%c💚 Мику Хацунэ: みくみくにしてあげる♪', 'color:#39c5bb;font-size:16px;font-weight:bold;');
    }
})();
</script>