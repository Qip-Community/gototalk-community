/* 🎃 ХЭЛЛОУИН 2026 🎃 */
(function() {
    const today = new Date();
    const isOctober = today.getMonth() === 9;
    let halloweenMode = localStorage.getItem('qip-halloween');
    if (halloweenMode === null) halloweenMode = isOctober ? 'on' : 'off';

    function applyHalloween(mode) {
        if (mode === 'on') {
            document.body.classList.add('halloween-mode');
            addBanner(); addPumpkins(); startBats();
        } else {
            document.body.classList.remove('halloween-mode');
            removeBanner(); removePumpkins(); stopBats();
        }
        localStorage.setItem('qip-halloween', mode);
    }

    function addBanner() {
        if (document.querySelector('.halloween-banner')) return;
        const banner = document.createElement('div');
        banner.className = 'halloween-banner';
        banner.innerHTML = '🎃 Happy Halloween! Скидки на ужас — только сегодня! 🦇';
        const header = document.querySelector('header');
        if (header && header.parentNode) header.parentNode.insertBefore(banner, header.nextSibling);
    }

    function removeBanner() {
        const b = document.querySelector('.halloween-banner');
        if (b) b.remove();
    }

    function addPumpkins() {
        const hero = document.querySelector('.hero');
        if (!hero || hero.querySelector('.halloween-pumpkin')) return;
        const positions = [
            { left: '5%', top: '20%', delay: '0s' },
            { right: '5%', top: '30%', delay: '0.5s' },
            { left: '10%', bottom: '15%', delay: '1s' },
            { right: '10%', bottom: '20%', delay: '1.5s' }
        ];
        positions.forEach(pos => {
            const p = document.createElement('span');
            p.className = 'halloween-pumpkin';
            p.textContent = '🎃';
            p.style.position = 'absolute';
            p.style.left = pos.left || 'auto';
            p.style.right = pos.right || 'auto';
            p.style.top = pos.top || 'auto';
            p.style.bottom = pos.bottom || 'auto';
            p.style.animationDelay = pos.delay;
            hero.appendChild(p);
        });
    }

    function removePumpkins() {
        document.querySelectorAll('.halloween-pumpkin').forEach(p => p.remove());
    }

    let batInterval = null;
    let batContainer = null;

    function startBats() {
        if (batInterval) return;
        batContainer = document.createElement('div');
        batContainer.id = 'halloween-bats';
        document.body.appendChild(batContainer);

        function spawnBat() {
            const bat = document.createElement('span');
            bat.className = 'halloween-bat';
            bat.textContent = Math.random() > 0.5 ? '🦇' : '👻';
            bat.style.top = Math.random() * 80 + 10 + 'vh';
            bat.style.animationDuration = (Math.random() * 6 + 6) + 's';
            bat.style.fontSize = (Math.random() * 16 + 16) + 'px';
            batContainer.appendChild(bat);
            setTimeout(() => bat.remove(), 12000);
        }

        for (let i = 0; i < 3; i++) setTimeout(spawnBat, i * 800);
        batInterval = setInterval(spawnBat, 4000);
    }

    function stopBats() {
        if (batInterval) { clearInterval(batInterval); batInterval = null; }
        if (batContainer) { batContainer.remove(); batContainer = null; }
    }

    function addToggle() {
        const nav = document.querySelector('nav');
        if (!nav || document.querySelector('.halloween-toggle')) return;
        const btn = document.createElement('button');
        btn.className = 'halloween-toggle';
        btn.textContent = '🎃 Хэллоуин';
        btn.addEventListener('click', function() {
            const isOn = document.body.classList.contains('halloween-mode');
            applyHalloween(isOn ? 'off' : 'on');
        });
        nav.appendChild(btn);
    }

    document.addEventListener('DOMContentLoaded', function() {
        addToggle();
        if (halloweenMode === 'on') applyHalloween('on');
    });
})();