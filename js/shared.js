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
    if (rank === 1) return { name: "Grand Maître PokéBat", color: "#FFDE00", bg: "#CC0000" };
    if (rank <= 100) return { name: "Ligue des Maîtres", color: "#FFFFFF", bg: "#8A2BE2" };
    if (rank <= 400) return { name: "Ligue des Hyper Dresseurs", color: "#FFFFFF", bg: "#3B4CCA" };
    if (rank <= 700) return { name: "Ligue des Bons Dresseurs", color: "#FFFFFF", bg: "#4CAF50" };
    return { name: "Dresseurs Débutants", color: "#333333", bg: "#E6F0FA" };
}

function displayRank() {
    const badge = document.getElementById('rank-badge');
    if (!badge) return;
    
    const rank = getRank();
    const league = getLeagueInfo(rank);
    
    badge.innerHTML = `
        <div class="league-name" style="background: ${league.bg}; color: ${league.color}">
            ${league.name}
        </div>
        <div class="rank-number">
            Rang : ${rank}
            <span class="reset-btn" onclick="resetRank()" title="Réinitialiser">🔄</span>
        </div>
    `;
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

function loadHomeLeaderboard() {
    const container = document.getElementById('home-leaderboard');
    if (!container) return;
    
    container.innerHTML = '';
    const rank = getRank();
    const startRank = Math.max(1, rank - 2);
    const endRank = Math.min(1000, rank + 2);
    
    for (let r = startRank; r <= endRank; r++) {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        if (r === rank) item.classList.add('is-baptiste');
        
        const league = getLeagueInfo(r);
        const name = (r === rank) ? "Baptiste" : getPlayerName(r);
        
        item.innerHTML = `
            <span class="item-rank">#${r}</span>
            <span class="item-name">${name}</span>
            <span class="item-league" style="background:${league.bg}; color:${league.color}">${league.name}</span>
        `;
        container.appendChild(item);
    }
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
    const bapRankNum = document.getElementById('bap-rank-number');
    
    if (listElement && bapRankNum) {
        const oldRank = getRank();
        const newRank = Math.max(1, oldRank - pointsEarnedThisSession);
        
        const bapLeagueBadge = document.getElementById('bap-league-badge');
        
        bapRankNum.textContent = `#${oldRank}`;
        if (bapLeagueBadge) {
            const oldLeague = getLeagueInfo(oldRank);
            bapLeagueBadge.textContent = oldLeague.name;
            bapLeagueBadge.style.background = oldLeague.bg;
            bapLeagueBadge.style.color = oldLeague.color;
        }
        
        listElement.innerHTML = '';
        
        const endRank = Math.min(1000, oldRank + 3);
        const startRank = Math.max(1, newRank - 3);
        
        for (let r = startRank; r <= endRank; r++) {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            const league = getLeagueInfo(r);
            item.innerHTML = `
                <span class="item-rank">#${r}</span>
                <span class="item-name">${getPlayerName(r)}</span>
                <span class="item-league" style="background:${league.bg}; color:${league.color}">${league.name}</span>
            `;
            listElement.appendChild(item);
        }
        
        const itemHeight = 51; // approx height
        const startOffset = 90 - 25 - ((oldRank - startRank) * itemHeight);
        listElement.style.transition = 'none';
        listElement.style.transform = `translateY(${startOffset}px)`;
        
        setTimeout(() => {
            listElement.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)';
            const finalOffset = 90 - 25 - ((newRank - startRank) * itemHeight);
            listElement.style.transform = `translateY(${finalOffset}px)`;
            
            let currentDisplayRank = oldRank;
            const stepTime = Math.max(50, 2000 / Math.max(1, oldRank - newRank));
            
            const interval = setInterval(() => {
                if (currentDisplayRank > newRank) {
                    currentDisplayRank--;
                    bapRankNum.textContent = `#${currentDisplayRank}`;
                    const currentLeague = getLeagueInfo(currentDisplayRank);
                    if (bapLeagueBadge) {
                        bapLeagueBadge.textContent = currentLeague.name;
                        bapLeagueBadge.style.background = currentLeague.bg;
                        bapLeagueBadge.style.color = currentLeague.color;
                    }
                    // Optional tiny tick sound
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

document.addEventListener('DOMContentLoaded', () => {
    displayRank();
    loadHomeLeaderboard();
});
