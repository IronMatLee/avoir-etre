const sentencesBank = [
    // Baptiste
    { text: "Baptiste _________ une très belle collection de cartes Pokémon.", expected: "a" },
    { text: "Baptiste _________ le meilleur dresseur de la région.", expected: "est" },
    { text: "Baptiste _________ attrapé un Pikachu sauvage !", expected: "a" },
    { text: "Baptiste _________ prêt pour son prochain combat.", expected: "est" },
    { text: "Baptiste _________ un nouveau jeu vidéo.", expected: "a" },
    // Laure
    { text: "Laure _________ une grande soeur géniale.", expected: "est" },
    { text: "Laure _________ beaucoup de devoirs à faire ce soir.", expected: "a" },
    { text: "Laure _________ très gentille avec son petit frère.", expected: "est" },
    { text: "Laure _________ un magnifique dessin dans sa chambre.", expected: "a" },
    { text: "Laure _________ en classe avec ses amies.", expected: "est" },
    // Marie (maîtresse)
    { text: "Marie, la maîtresse, _________ préparé une belle leçon.", expected: "a" },
    { text: "Marie _________ très contente du travail de Baptiste.", expected: "est" },
    { text: "Marie _________ un tableau magique dans sa classe.", expected: "a" },
    { text: "Marie _________ toujours souriante le matin.", expected: "est" },
    { text: "Marie _________ beaucoup de livres passionnants.", expected: "a" },
    // Joseph & Angus
    { text: "Joseph et Angus _________ les meilleurs copains du monde.", expected: "sont" },
    { text: "Joseph et Angus _________ trouvé un trésor dans la cour.", expected: "ont" },
    { text: "Joseph _________ un super vélo bleu.", expected: "a" },
    { text: "Angus _________ très fort à la course.", expected: "est" },
    { text: "Joseph et Angus _________ invités à la fête de Baptiste.", expected: "sont" },
    { text: "Angus _________ une belle carte Dracaufeu.", expected: "a" },
    { text: "Joseph _________ un garçon très amusant.", expected: "est" },
    { text: "Angus et Joseph _________ des billes plein les poches.", expected: "ont" },
    { text: "Joseph et Baptiste _________ dans la même équipe.", expected: "sont" },
    { text: "Angus _________ perdu sa trousse ce matin.", expected: "a" },
    // Manon
    { text: "Manon _________ la plus jolie robe de l'école.", expected: "a" },
    { text: "Manon _________ l'amoureuse de Baptiste.", expected: "est" },
    { text: "Manon _________ apporté des bonbons pour tout le monde.", expected: "a" },
    { text: "Manon _________ toujours très douce.", expected: "est" },
    { text: "Manon _________ un beau sourire.", expected: "a" },
    // Je
    { text: "Je _________ prêt pour attraper des Pokémon !", expected: "suis" },
    { text: "J'_________ très faim après l'école.", expected: "ai" },
    { text: "Je _________ le champion de la ligue !", expected: "suis" },
    { text: "J'_________ un nouveau sac à dos Pikachu.", expected: "ai" },
    { text: "Je _________ toujours là pour aider mes amis.", expected: "suis" },
    { text: "J'_________ une super idée de jeu.", expected: "ai" },
    { text: "Je _________ fatigué après cette longue journée.", expected: "suis" },
    { text: "J'_________ de la chance d'avoir de bons amis.", expected: "ai" },
    { text: "Je _________ en train de lire une bande dessinée.", expected: "suis" },
    { text: "J'_________ peur des fantômes dans le manoir.", expected: "ai" },
    // Tu
    { text: "Tu _________ mon meilleur ami pour la vie.", expected: "es" },
    { text: "Tu _________ trouvé la bonne réponse, bravo !", expected: "as" },
    { text: "Tu _________ en avance ce matin.", expected: "es" },
    { text: "Tu _________ un magnifique ballon rouge.", expected: "as" },
    { text: "Tu _________ le plus rapide de la classe.", expected: "es" },
    { text: "Tu _________ beaucoup de chance aujourd'hui.", expected: "as" },
    { text: "Tu _________ très fort aux jeux vidéo.", expected: "es" },
    { text: "Tu _________ mangé toute ton assiette.", expected: "as" },
    { text: "Tu _________ prêt pour partir en vacances.", expected: "es" },
    { text: "Tu _________ un super pouvoir secret.", expected: "as" },
    // Il / Elle / On
    { text: "Pikachu _________ le meilleur Pokémon électrique.", expected: "est" },
    { text: "Le chien _________ aboyé toute la nuit.", expected: "a" },
    { text: "Elle _________ une très belle voix.", expected: "a" },
    { text: "On _________ bien rigolé à la récréation.", expected: "a" },
    { text: "Il _________ caché derrière le grand arbre.", expected: "est" },
    { text: "On _________ fatigués après le sport.", expected: "est" }, // Grammatically "on est"
    { text: "Le chat _________ sur le toit de la maison.", expected: "est" },
    { text: "Dracaufeu _________ des flammes puissantes.", expected: "a" },
    { text: "Elle _________ la première de la course.", expected: "est" },
    { text: "Il _________ oublié son cahier à la maison.", expected: "a" },
    // Nous
    { text: "Nous _________ très contents d'aller au parc.", expected: "sommes" },
    { text: "Nous _________ beaucoup de devoirs aujourd'hui.", expected: "avons" },
    { text: "Nous _________ les champions du tournoi !", expected: "sommes" },
    { text: "Nous _________ trouvé un insecte rare.", expected: "avons" },
    { text: "Nous _________ prêts pour le grand voyage.", expected: "sommes" },
    { text: "Nous _________ mangé une glace au chocolat.", expected: "avons" },
    { text: "Nous _________ dans le même bus que Manon.", expected: "sommes" },
    { text: "Nous _________ une cabane secrète dans le bois.", expected: "avons" },
    { text: "Nous _________ invincibles quand nous jouons ensemble.", expected: "sommes" },
    { text: "Nous _________ gagné le match de foot.", expected: "avons" },
    // Vous
    { text: "Vous _________ de la chance de jouer à ce jeu.", expected: "avez" },
    { text: "Vous _________ les bienvenus à ma fête.", expected: "êtes" },
    { text: "Vous _________ vu ce beau film au cinéma ?", expected: "avez" },
    { text: "Vous _________ très forts en mathématiques.", expected: "êtes" },
    { text: "Vous _________ un magnifique jardin.", expected: "avez" },
    { text: "Vous _________ en train de crier trop fort.", expected: "êtes" },
    { text: "Vous _________ pris vos manteaux pour sortir ?", expected: "avez" },
    { text: "Vous _________ cachés sous la table.", expected: "êtes" },
    { text: "Vous _________ des idées géniales.", expected: "avez" },
    { text: "Vous _________ toujours prêts à jouer.", expected: "êtes" },
    // Ils / Elles
    { text: "Les chiens _________ dans le jardin en train de courir.", expected: "sont" },
    { text: "Les oiseaux _________ fait un nid dans l'arbre.", expected: "ont" },
    { text: "Ils _________ trouvés un trésor caché dans le sable.", expected: "ont" },
    { text: "Les élèves _________ bien travaillé ce matin.", expected: "ont" },
    { text: "Elles _________ de magnifiques robes de princesses.", expected: "ont" },
    { text: "Les Pokémon _________ retournés dans leurs Poké Balls.", expected: "sont" },
    { text: "Elles _________ très gentilles avec les petits.", expected: "sont" },
    { text: "Ils _________ un grand terrain pour jouer.", expected: "ont" },
    { text: "Les nuages _________ gris et la pluie tombe.", expected: "sont" },
    { text: "Ils _________ mangé tous les gâteaux !", expected: "ont" },
    // Extra mix
    { text: "Joseph _________ un rire très communicatif.", expected: "a" },
    { text: "Manon et Laure _________ amies.", expected: "sont" },
    { text: "Angus _________ oublié de fermer la porte.", expected: "a" },
    { text: "Baptiste et Joseph _________ de redoutables dresseurs.", expected: "sont" },
    { text: "Marie _________ félicité Baptiste pour son travail.", expected: "a" },
    { text: "Laure _________ la meilleure pour raconter des histoires.", expected: "est" },
    { text: "Je _________ impatient de voir la suite de mon dessin animé.", expected: "suis" },
    { text: "Tu _________ vraiment beaucoup de cartes brillantes.", expected: "as" },
    { text: "Nous _________ fait une bataille d'eau géante.", expected: "avons" },
    { text: "Bulbizarre _________ un type plante très utile.", expected: "est" }
];

const conjugationsAvoir = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
const conjugationsEtre = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'];
const allLabels = [...conjugationsAvoir, ...conjugationsEtre];

let currentSentences = [];
let currentSentenceIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    initGame2();
    initDragAndDrop(2); // from shared.js
});

function initGame2() {
    let shuffled = [...sentencesBank];
    shuffleArray(shuffled); // from shared.js
    currentSentences = shuffled.slice(0, 10);
    currentSentenceIndex = 0;
    
    loadSentence();
}

function loadSentence() {
    if (currentSentenceIndex >= currentSentences.length) {
        showVictoryModal(); // from shared.js
        return;
    }

    const sentenceObj = currentSentences[currentSentenceIndex];
    document.getElementById('current-sentence-idx').textContent = currentSentenceIndex + 1;
    
    const parts = sentenceObj.text.split('_________');
    const container = document.getElementById('sentence-text');
    
    container.innerHTML = `
        ${parts[0]}
        <span class="dropzone inline-dropzone" data-expected="${sentenceObj.expected}" data-group="2"></span>
        ${parts[1]}
    `;

    const bank2 = document.getElementById('bank2');
    bank2.innerHTML = '';
    
    let labelsToUse = [...allLabels];
    shuffleArray(labelsToUse);
    
    labelsToUse.forEach(text => {
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = text;
        label.setAttribute('data-value', text);
        bank2.appendChild(label);
    });
}

function checkGame2SentenceWin() {
    const dz = document.querySelector('#exercise2 .inline-dropzone');
    if (dz.children.length > 0) {
        setTimeout(() => {
            currentSentenceIndex++;
            loadSentence();
        }, 1500); 
    }
}
