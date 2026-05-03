const pronounsAvoir = ['J\'', 'Tu', 'Il / Elle / On', 'Nous', 'Vous', 'Ils / Elles'];
const pronounsEtre = ['Je', 'Tu', 'Il / Elle / On', 'Nous', 'Vous', 'Ils / Elles'];
const conjugationsAvoir = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
const conjugationsEtre = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'];

let currentPhase = 0;
let phaseOrder = [];

document.addEventListener('DOMContentLoaded', () => {
    initGame1();
    initDragAndDrop(1); // from shared.js
});

function initGame1() {
    currentPhase = 0;
    phaseOrder = Math.random() > 0.5 ? ['avoir', 'etre'] : ['etre', 'avoir'];
    
    const rowsAvoir = document.getElementById('rows-avoir');
    const rowsEtre = document.getElementById('rows-etre');
    
    rowsAvoir.innerHTML = '';
    rowsEtre.innerHTML = '';

    for (let i = 0; i < conjugationsAvoir.length; i++) {
        const rowAvoir = document.createElement('div');
        rowAvoir.className = 'row';
        rowAvoir.innerHTML = `
            <div class="pronoun">${pronounsAvoir[i]}</div>
            <div class="dropzone" data-expected="${conjugationsAvoir[i]}" data-group="1"></div>
        `;
        rowsAvoir.appendChild(rowAvoir);

        const rowEtre = document.createElement('div');
        rowEtre.className = 'row';
        rowEtre.innerHTML = `
            <div class="pronoun">${pronounsEtre[i]}</div>
            <div class="dropzone" data-expected="${conjugationsEtre[i]}" data-group="1"></div>
        `;
        rowsEtre.appendChild(rowEtre);
    }

    loadPhase1();
}

function loadPhase1() {
    const colAvoir = document.getElementById('col-avoir');
    const colEtre = document.getElementById('col-etre');
    const bank1 = document.getElementById('bank1');
    
    if (currentPhase >= phaseOrder.length) {
        colAvoir.classList.remove('hidden');
        colEtre.classList.remove('hidden');
        setTimeout(() => showVictoryModal(10), 500);
        return;
    }

    const verb = phaseOrder[currentPhase];
    bank1.innerHTML = '';

    let labels = [];
    if (verb === 'avoir') {
        colAvoir.classList.remove('hidden');
        colEtre.classList.add('hidden');
        labels = [...conjugationsAvoir];
    } else {
        colEtre.classList.remove('hidden');
        colAvoir.classList.add('hidden');
        labels = [...conjugationsEtre];
    }

    shuffleArray(labels);
    labels.forEach(text => {
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = text;
        label.setAttribute('data-value', text);
        bank1.appendChild(label);
    });
}

window.checkGame1Win = function() {
    const verb = phaseOrder[currentPhase];
    const col = document.getElementById('col-' + verb);
    const dropzones = col.querySelectorAll('.dropzone:not(.bank)');
    let allFilled = true;
    dropzones.forEach(dz => {
        if (dz.children.length === 0) allFilled = false;
    });

    if (allFilled) {
        setTimeout(() => {
            currentPhase++;
            loadPhase1();
        }, 800); // short delay to show completion before switching
    }
};
