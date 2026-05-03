// ==========================================
// AUDIO SYSTEM (Web Audio API)
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.2);
    }
}

// ==========================================
// RANKING SYSTEM
// ==========================================
function getRank() {
    let rank = localStorage.getItem('pokeRank');
    if (rank === null) {
        rank = 1000;
        localStorage.setItem('pokeRank', rank);
    }
    return parseInt(rank, 10);
}

function updateRank(pointsGained) {
    let rank = getRank();
    rank -= pointsGained;
    if (rank < 1) rank = 1;
    localStorage.setItem('pokeRank', rank);
    displayRank();
}

function getLeagueInfo(rank) {
    if (rank === 1) return { name: "Grand Maître Pokémon", color: "#FFDE00", bg: "#CC0000" };
    if (rank <= 100) return { name: "Ligue des Maîtres", color: "#FFFFFF", bg: "#8A2BE2" };
    if (rank <= 400) return { name: "Ligue des Hyper Dresseurs", color: "#FFFFFF", bg: "#3B4CCA" };
    if (rank <= 700) return { name: "Ligue des Bons Dresseurs", color: "#FFFFFF", bg: "#4CAF50" };
    return { name: "Dresseurs Débutants", color: "#333333", bg: "#E6F0FA" };
}

function displayRank() {
    const rank = getRank();
    
    // For exercise pages
    const badge = document.getElementById('rank-badge');
    if (badge) {
        badge.innerHTML = `
            <div class="rank-number">Rang : ${rank}</div>
        `;
    }
    
    // For home page
    const homeRankDisplay = document.getElementById('home-rank-display');
    if (homeRankDisplay) {
        homeRankDisplay.innerHTML = `
            Rang : ${rank}
            <span class="reset-btn" onclick="resetRank()" title="Réinitialiser">🔄</span>
        `;
    }
}

function resetRank() {
    if (confirm("Veux-tu vraiment réinitialiser ton rang et recommencer depuis le début (Rang 1000) ?")) {
        localStorage.setItem('pokeRank', 1000);
        displayRank();
        if (document.getElementById('home-leaderboard')) {
            loadHomeLeaderboard();
        }
    }
}

function generateLeaderboardData(targetRank) {
    let items = [];
    if (targetRank <= 10) {
        for (let i = 1; i <= 10; i++) items.push(i);
    } else {
        items.push(1, 2, 3, 'break');
        let start = targetRank - 3;
        let end = targetRank + 2;
        
        if (end > 1000) {
            start -= (end - 1000);
            end = 1000;
        }
        
        for (let i = start; i <= end; i++) {
            items.push(i);
        }
    }
    return items;
}

function renderLeaderboardHTML(rank, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    const data = generateLeaderboardData(rank);
    
    data.forEach(item => {
        if (item === 'break') {
            const div = document.createElement('div');
            div.className = 'leaderboard-break';
            div.textContent = '...';
            container.appendChild(div);
        } else {
            const r = item;
            const div = document.createElement('div');
            div.className = 'leaderboard-item';
            
            if (r === rank) div.classList.add('is-baptiste');
            
            const league = getLeagueInfo(r);
            const name = (r === rank) ? "Baptiste" : getPlayerName(r);
            
            div.innerHTML = `
                <span class="item-rank">#${r}</span>
                <span class="item-name">${name}</span>
                <span class="item-league" style="background:${league.bg}; color:${league.color}">${league.name}</span>
            `;
            container.appendChild(div);
        }
    });
}

function loadHomeLeaderboard() {
    renderLeaderboardHTML(getRank(), 'home-leaderboard');
}

// ==========================================
// DRAG AND DROP (Pointer Events)
// ==========================================
let draggedElement = null;
let originalParent = null;
let startX = 0, startY = 0;
let initialRect = null;
let currentGameType = 0; // 1 = tableau, 2 = trous
let pointsEarnedThisSession = 0;

const fakeNames = ["Sacha", "Ondine", "Pierre", "Régis", "Léa", "Hugo", "Emma", "Lucas", "Chloé", "Arthur", "Manon", "Nathan", "Camille", "Louis", "Margaux", "Jules", "Inès", "Enzo", "Sarah", "Antoine", "Clara", "Paul", "Lina", "Victor", "Alice", "Tom", "Lola", "Mathis", "Eva", "Gabin", "Zoé", "Raphaël", "Louna", "Maël", "Juliette", "Noah", "Romane", "Ethan", "Nina", "Gabriel", "Léna", "Adam", "Lisa", "Mila", "Liam", "Rose", "Tiago", "Ambre"];

function getPlayerName(rank) {
    if (rank === 1) return "Sacha";
    if (rank === 2) return "Ondine";
    if (rank === 3) return "Pierre";
    if (rank === 4) return "Régis";
    const index = (rank * 17) % fakeNames.length;
    return fakeNames[index];
}

function initDragAndDrop(gameType) {
    currentGameType = gameType;
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    
    document.addEventListener('touchmove', (e) => {
        if (draggedElement) e.preventDefault();
    }, { passive: false });
}

function onPointerDown(e) {
    // Only target `.label` items inside a bank, OR ensure they are draggable. 
    // We remove the class `success-drop` on success, so they aren't draggable anymore.
    if (e.target.classList.contains('label') && !e.target.classList.contains('success-drop')) {
        draggedElement = e.target;
        originalParent = draggedElement.parentNode;
        
        initialRect = draggedElement.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;

        draggedElement.style.width = initialRect.width + 'px';
        draggedElement.style.height = initialRect.height + 'px';
        
        draggedElement.style.position = 'fixed';
        draggedElement.style.left = initialRect.left + 'px';
        draggedElement.style.top = initialRect.top + 'px';
        draggedElement.style.margin = '0';
        document.body.appendChild(draggedElement);
        
        draggedElement.classList.add('dragging');
        
        // Initialize Audio Context on first interaction
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        e.preventDefault();
    }
}

function onPointerMove(e) {
    if (!draggedElement) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    draggedElement.style.left = (initialRect.left + dx) + 'px';
    draggedElement.style.top = (initialRect.top + dy) + 'px';

    document.querySelectorAll('.dropzone').forEach(dz => dz.classList.remove('active-hover'));
    
    draggedElement.style.visibility = 'hidden';
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    draggedElement.style.visibility = 'visible';

    if (elemBelow && elemBelow.closest('.dropzone:not(.bank)')) {
        const dz = elemBelow.closest('.dropzone:not(.bank)');
        if (dz.children.length === 0) {
            dz.classList.add('active-hover');
        }
    }
}

function onPointerUp(e) {
    if (!draggedElement) return;

    document.querySelectorAll('.dropzone').forEach(dz => dz.classList.remove('active-hover'));

    draggedElement.style.visibility = 'hidden';
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    draggedElement.style.visibility = 'visible';

    let dropSuccess = false;

    if (elemBelow) {
        const dropzone = elemBelow.closest('.dropzone:not(.bank)');
        if (dropzone && dropzone.children.length === 0) {
            const expected = dropzone.getAttribute('data-expected');
            const value = draggedElement.getAttribute('data-value');

            if (expected === value) {
                dropSuccess = true;
                dropzone.appendChild(draggedElement);
                resetElementStyle(draggedElement);
                draggedElement.classList.add('success-drop');
                
                playSound('success');
                createLocalConfetti(e.clientX, e.clientY);
                pointsEarnedThisSession++; // Add point instead of updating immediately

                if (currentGameType === 1 && typeof window.checkGame1Win === 'function') window.checkGame1Win();
                if (currentGameType === 2 && typeof window.checkGame2SentenceWin === 'function') window.checkGame2SentenceWin();
                if (currentGameType === 3 && typeof window.checkGame3SentenceWin === 'function') window.checkGame3SentenceWin();

            } else {
                dropzone.appendChild(draggedElement);
                resetElementStyle(draggedElement);
                draggedElement.classList.add('error-shake');
                
                playSound('error');
                
                const el = draggedElement;
                const parent = originalParent;
                setTimeout(() => {
                    el.classList.remove('error-shake');
                    parent.appendChild(el);
                }, 500);
                dropSuccess = true;
            }
        }
    }

    if (!dropSuccess) {
        originalParent.appendChild(draggedElement);
        resetElementStyle(draggedElement);
    }

    draggedElement.classList.remove('dragging');
    draggedElement = null;
    originalParent = null;
}

function resetElementStyle(el) {
    el.style.position = '';
    el.style.left = '';
    el.style.top = '';
    el.style.width = '';
    el.style.height = '';
    el.style.margin = '';
}

// ==========================================
// UTILS & EFFECTS
// ==========================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createLocalConfetti(x, y) {
    if (typeof confetti !== 'undefined') {
        const originX = x / window.innerWidth;
        const originY = y / window.innerHeight;
        confetti({
            particleCount: 30,
            spread: 40,
            origin: { x: originX, y: originY },
            colors: ['#FFDE00', '#CC0000', '#3B4CCA', '#4CAF50']
        });
    }
}

function showVictoryModal() {
    document.getElementById('victory-modal').classList.remove('hidden');
    if (typeof confetti !== 'undefined') {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFDE00', '#CC0000', '#3B4CCA']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFDE00', '#CC0000', '#3B4CCA']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Leaderboard Animation
    const listElement = document.getElementById('leaderboard-list');
    
    if (listElement) {
        const oldRank = getRank();
        const newRank = Math.max(1, oldRank - pointsEarnedThisSession);
        
        // Initial render
        renderLeaderboardHTML(oldRank, 'leaderboard-list');
        
        setTimeout(() => {
            let currentDisplayRank = oldRank;
            const stepTime = Math.max(80, 2000 / Math.max(1, oldRank - newRank));
            
            const interval = setInterval(() => {
                if (currentDisplayRank > newRank) {
                    currentDisplayRank--;
                    renderLeaderboardHTML(currentDisplayRank, 'leaderboard-list');
                    if (currentDisplayRank % 2 === 0) playSound('success');
                } else {
                    clearInterval(interval);
                    localStorage.setItem('pokeRank', newRank);
                    displayRank();
                    playSound('success'); 
                }
            }, stepTime);
            
        }, 1000);
    } else {
        const oldRank = getRank();
        const newRank = Math.max(1, oldRank - pointsEarnedThisSession);
        localStorage.setItem('pokeRank', newRank);
        displayRank();
    }
}

const LEAGUES = [
    { threshold: 0, name: "Dresseur Débutant", bg: "#f0f0f0", color: "#333" },
    { threshold: 200, name: "Dresseur Prometteur", bg: "#dcd0ff", color: "#4b0082" },
    { threshold: 400, name: "Champion d'Arène", bg: "#ffe4b5", color: "#8b4500" },
    { threshold: 600, name: "Maître de la Ligue", bg: "#ffcccb", color: "#8b0000" },
    { threshold: 800, name: "Grand Maître Pokémon", bg: "linear-gradient(45deg, #FFD700, #FFA500)", color: "#000" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Init Fullscreen Button
    initFullscreenButton();

    displayRank();
    
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadHomeLeaderboard();
        initHome();
    }
});

function initFullscreenButton() {
    const avatar = document.querySelector('.header-avatar');
    if (!avatar) return;

    avatar.style.cursor = 'pointer';

    avatar.addEventListener('click', () => {
        const docElm = document.documentElement;
        const requestFS = docElm.requestFullscreen || docElm.webkitRequestFullscreen || docElm.mozRequestFullScreen || docElm.msRequestFullscreen;
        const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        const isFS = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

        if (!isFS) {
            if (requestFS) {
                let promise = requestFS.call(docElm);
                if (promise) promise.catch(err => console.log(err));
            }
        } else {
            if (exitFS) {
                exitFS.call(document);
            }
        }
    });
}
