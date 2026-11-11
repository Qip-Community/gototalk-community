/* ============================================ */
/* ПАСХАЛКА: Мику Хацунэ для GoToTalk Community */
/* ============================================ */
(function mikuEasterEgg() {
    'use strict';

    let buffer = '';
    const SECRETS = ['monika', 'miku', 'hatsune'];
    const MAX_LEN = 7;

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

    window.miku = spawnMiku;
    window.monika = spawnMiku;

    function replaceEverything() {
        // 1. Все картинки на сайте
        const imgs = document.querySelectorAll('img:not(#miku-gif)');
        imgs.forEach(img => {
            img.src = 'miku-dance.gif'; 
            img.style.objectFit = 'contain';
            img.style.background = 'rgba(57, 197, 187, 0.2)';
            if (img.classList.contains('launcher-img') || img.classList.contains('hero-img')) {
                img.style.width = '80px'; 
                img.style.height = '80px';
            }
        });

        // 2. Логотип в шапке
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.innerHTML = '📡 MIKU <span>HATSUNE</span>';
        }
        
        // 3. Заголовок вкладки браузера
        document.title = "💚 MIKU MIKU NI SHITE AGERU 💚";
    }

    function spawnMiku() {
        if (document.getElementById('miku-fullscreen')) return;

        replaceEverything();

        if (!document.getElementById('miku-styles')) {
            const style = document.createElement('style');
            style.id = 'miku-styles';
            style.textContent = `
                #miku-fullscreen {
                    position: fixed; inset: 0; z-index: 999999;
                    background-color: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
                    display: flex; flex-direction: column; justify-content: center; align-items: center;
                    opacity: 0; transition: opacity 0.5s ease-in-out; pointer-events: none;
                }
                #miku-fullscreen.show { opacity: 1; pointer-events: auto; }
                .miku-dance-container {
                    display: flex; justify-content: center; align-items: center;
                    max-width: 90vw; max-height: 80vh; cursor: pointer; position: relative;
                }
                #miku-gif {
                    max-width: 100%; max-height: 80vh; object-fit: contain;
                    border-radius: 16px; box-shadow: 0 0 60px rgba(57, 197, 187, 0.8);
                    animation: miku-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transition: transform 0.2s;
                }
                .miku-close-btn {
                    position: absolute; top: -15px; right: -15px;
                    background: #ff4757; color: white; border: 3px solid #fff;
                    border-radius: 50%; width: 40px; height: 40px;
                    font-size: 20px; font-weight: bold; cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    display: flex; justify-content: center; align-items: center;
                    transition: transform 0.2s, background 0.2s; z-index: 10;
                }
                .miku-close-btn:hover { transform: scale(1.1); background: #ff6b81; }
                #miku-text {
                    margin-top: 24px;
                    background: linear-gradient(135deg, #39c5bb, #2a9d94);
                    color: #fff; padding: 14px 32px; border-radius: 30px;
                    font-family: 'Segoe UI', Arial, sans-serif; font-size: 24px;
                    font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    border: 3px solid #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    pointer-events: none; white-space: nowrap;
                    animation: miku-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s backwards;
                }
                @keyframes miku-pop {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        const overlay = document.createElement('div');
        overlay.id = 'miku-fullscreen';

        const gifContainer = document.createElement('div');
        gifContainer.className = 'miku-dance-container';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'miku-close-btn';
        closeBtn.innerHTML = '✕';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMiku();
        });

        const img = document.createElement('img');
        img.id = 'miku-gif';
        img.src = 'miku-dance.gif'; 
        img.alt = 'Miku Dancing';
        
        img.onerror = function() {
            img.style.display = 'none';
            const fallback = document.createElement('h1');
            fallback.textContent = '💃 Мику танцует! 💃';
            fallback.style.color = '#fff';
            fallback.style.fontSize = '4rem';
            fallback.style.textShadow = '0 0 20px #39c5bb';
            gifContainer.appendChild(fallback);
        };

        const textBox = document.createElement('div');
        textBox.id = 'miku-text';
        textBox.textContent = '💚 Мику Хацунэ: みくみくにしてあげる♪';

        gifContainer.appendChild(img);
        gifContainer.appendChild(closeBtn);
        overlay.appendChild(gifContainer);
        overlay.appendChild(textBox);
        document.body.appendChild(overlay);

        const audio = new Audio('miku-song.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        window.mikuAudio = audio;
        
        audio.play().catch(e => {
            console.log('Автоплей музыки заблокирован браузером.');
        });

        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMiku();
        });

        console.log('%c💚 Мику Хацунэ: みくみくにしてあげる♪', 'color:#39c5bb;font-size:16px;font-weight:bold;');
    }

    function closeMiku() {
        const overlay = document.getElementById('miku-fullscreen');
        if (!overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 500);
        console.log('Окно закрыто, но Мику осталась на сайте, а музыка играет. F5 чтобы вернуть всё назад.');
    }
})();