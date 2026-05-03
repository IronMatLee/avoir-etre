const pronounsAvoir = ['J\'', 'Tu', 'Il / Elle / On', 'Nous', 'Vous', 'Ils / Elles'];
const pronounsEtre = ['Je', 'Tu', 'Il / Elle / On', 'Nous', 'Vous', 'Ils / Elles'];
const conjugationsAvoir = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
const conjugationsEtre = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'];

document.addEventListener('DOMContentLoaded', () => {
    initGame1();
    initDragAndDrop(1); // from shared.js
});

function initGame1() {
    const rowsAvoir = document.getElementById('rows-avoir');
    const rowsEtre = document.getElementById('rows-etre');
    const bank1 = document.getElementById('bank1');
    
    rowsAvoir.innerHTML = '';
    rowsEtre.innerHTML = '';
    bank1.innerHTML = '';

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

    const container = document.querySelector('#exercise1 .table-container');
    const colAvoir = document.getElementById('col-avoir');
    const colEtre = document.getElementById('col-etre');
    if (Math.random() > 0.5) {
        container.appendChild(colAvoir);
        container.appendChild(colEtre);
    } else {
        container.appendChild(colEtre);
        container.appendChild(colAvoir);
    }

    const allLabels = [...conjugationsAvoir, ...conjugationsEtre];
    shuffleArray(allLabels);
    
    allLabels.forEach(text => {
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = text;
        label.setAttribute('data-value', text);
        bank1.appendChild(label);
    });
}

function checkGame1Win() {
    const dropzones = document.querySelectorAll('#exercise1 .dropzone:not(.bank)');
    let allFilled = true;
    dropzones.forEach(dz => {
        if (dz.children.length === 0) allFilled = false;
    });

    if (allFilled) {
        setTimeout(showVictoryModal, 500); // from shared.js
    }
}
