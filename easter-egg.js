<!-- === ПАСХАЛКА: набери "miku", "monika" или "hatsune" (или вызови miku() / monika() в консоли) === -->
<script>
(function mikuEasterEgg() {
    'use strict';

    let buffer = '';
    const SECRETS = ['monika', 'miku', 'hatsune'];
    const MAX_LEN = 7;
    let backgroundAudio = null; // Для музыки, которая играет после закрытия

    // === Обработка ввода с клавиатуры ===
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

    // === API для консоли ===
    window.miku = spawnMiku;
    window.monika = spawnMiku;

    // === Замена всех картинок на Мику ===
    function replaceAllImages() {
        const imgs = document.querySelectorAll('img:not(#miku-gif)');
        imgs.forEach(img => {
            // Сохраняем оригинальный src, чтобы потом вернуть
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }
            img.src = 'miku-dance.gif'; // Подставляем Мику
            img.style.objectFit = 'contain';
            img.style.background = 'rgba(57, 197, 187, 0.2)'; // Легкий бирюзовый фон
        });
    }

    // === Возврат оригинальных картинок ===
    function restoreAllImages() {
        const imgs = document.querySelectorAll('img[data-original-src]');
        imgs.forEach(img => {
            img.src = img.dataset.originalSrc;
            img.style.objectFit = '';
            img.style.background = '';
            delete img.dataset.originalSrc;
        });
    }

    // === Логика запуска ===
    function spawnMiku() {
        if (document.getElementById('miku-fullscreen')) return;

        // Меняем картинки на сайте
        replaceAllImages();

        if (!document.getElementById('miku-styles')) {
            const style = document.createElement('style');
            style.id = 'miku-styles';
            style.textContent = `
                #miku-fullscreen {
                    position: fixed;
                    inset: 0;
                    z-index: 999999;
                    background-color: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
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
                    pointer-events: auto;
                }

                .miku-dance-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    max-width: 90vw;
                    max-height: 80vh;
                    cursor: pointer;
                    position: relative;
                }

                #miku-gif {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 16px;
                    box-shadow: 0 0 60px rgba(57, 197, 187, 0.8);
                    animation: miku-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transition: transform 0.2s;
                }

                /* Кнопка закрытия */
                .miku-close-btn {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    background: #ff4757;
                    color: white;
                    border: 3px solid #fff;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.2s, background 0.2s;
                    z-index: 10;
                }
                .miku-close-btn:hover {
                    transform: scale(1.1);
                    background: #ff6b81;
                }

                #miku-text {
                    margin-top: 24px;
                    background: linear-gradient(135deg, #39c5bb, #2a9d94);
                    color: #fff;
                    padding: 14px 32px;
                    border-radius: 30px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    font-size: 24px;
                    font-weight: bold;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    border: 3px solid #fff;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    pointer-events: none;
                    white-space: nowrap;
                    animation: miku-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s backwards;
                }

                @keyframes miku-pop {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                /* Плавающая кнопка выключения музыки */
                #miku-audio-stop {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000000;
                    background: rgba(57, 197, 187, 0.9);
                    color: #fff;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    border: 2px solid #fff;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    display: none; /* Скрыта по умолчанию */
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                #miku-audio-stop:hover {
                    background: #2a9d94;
                }
            `;
            document.head.appendChild(style);
        }

        // Создаём контейнер
        const overlay = document.createElement('div');
        overlay.id = 'miku-fullscreen';

        const gifContainer = document.createElement('div');
        gifContainer.className = 'miku-dance-container';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'miku-close-btn';
        closeBtn.innerHTML = '✕';
        closeBtn.title = 'Закрыть';
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

        // === АУДИО ===
        // Если музыка уже играла (после закрытия), останавливаем её и начинаем заново
        if (backgroundAudio) {
            backgroundAudio.pause();
            backgroundAudio = null;
        }
        
        const audio = new Audio('miku-song.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        overlay.dataset.audioId = 'miku-audio';
        overlay.appendChild(audio);
        
        audio.play().catch(e => {
            console.log('Автоплей музыки заблокирован браузером.');
        });

        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });

        // Клик по фону закрывает окно
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeMiku();
            }
        });

        console.log('%c💚 Мику Хацунэ: みくみくにしてあげる♪', 'color:#39c5bb;font-size:16px;font-weight:bold;');
    }

    // === Функция закрытия окна (но музыка играет дальше) ===
    function closeMiku() {
        const overlay = document.getElementById('miku-fullscreen');
        if (!overlay) return;

        // Возвращаем картинки на место
        restoreAllImages();

        // Забираем аудио из окна и делаем его фоновым
        const audio = overlay.querySelector('audio');
        if (audio) {
            backgroundAudio = audio;
            
            // Создаем кнопку для остановки фоновой музыки
            let stopBtn = document.getElementById('miku-audio-stop');
            if (!stopBtn) {
                stopBtn = document.createElement('div');
                stopBtn.id = 'miku-audio-stop';
                stopBtn.innerHTML = '⏸ Выключить музыку';
                stopBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (backgroundAudio) {
                        backgroundAudio.pause();
                        backgroundAudio = null;
                    }
                    stopBtn.style.display = 'none';
                });
                document.body.appendChild(stopBtn);
            }
            
            // Показываем кнопку и уменьшаем громкость для фона
            stopBtn.style.display = 'block';
            audio.volume = 0.3; // Делаем потише
        }

        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 500);
    }
})();
</script>