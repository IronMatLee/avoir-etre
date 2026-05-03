const subjectsByVerb = {
    'ai': ["J'"],
    'as': ["Tu"],
    'a': ["Il", "Elle", "On", "Baptiste", "Laure", "Le dresseur", "Maman", "Papa", "Le chien", "La maîtresse Marie", "Sacha", "Ondine", "Joseph", "Angus", "Manon"],
    'avons': ["Nous", "Toi et moi", "Laure et moi", "Baptiste et moi"],
    'avez': ["Vous", "Manon et toi", "Sacha et toi", "Angus et vous"],
    'ont': ["Ils", "Elles", "Les garçons", "Les Pokémon", "Mes amis", "Mes parents", "Les dresseurs", "Les lapins", "Laure et Baptiste"],
    'suis': ["Je"],
    'es': ["Tu"],
    'est': ["Il", "Elle", "On", "Baptiste", "Le chat", "Mon grand frère", "Le champion", "La maîtresse Marie", "Mon père", "Le Dracaufeu"],
    'sommes': ["Nous", "Toi et moi", "Manon et moi", "Sacha et moi"],
    'êtes': ["Vous", "Léa et toi", "Angus et toi"],
    'sont': ["Ils", "Elles", "Les amis", "Les Pokémon sauvages", "Mes parents", "Les dresseurs", "Laure et Manon", "Les petits chiens"]
};

// Base de données des 100 phrases
const sentencesDB = [
    { text: " a un super vélo.", verb: "a" },
    { text: " suis prêt pour le combat Pokémon.", verb: "suis" },
    { text: " avons trouvé un trésor dans le jardin.", verb: "avons" },
    { text: " sont les plus forts de l'école.", verb: "sont" },
    { text: " as une belle casquette bleue.", verb: "as" },
    { text: " êtes en retard pour l'école !", verb: "êtes" },
    { text: " ai très faim ce matin.", verb: "ai" },
    { text: " ont mangé tout le gâteau au chocolat.", verb: "ont" },
    { text: " est parti jouer au parc.", verb: "est" },
    { text: " es vraiment doué en mathématiques.", verb: "es" },
    { text: " sommes fatigués après la piscine.", verb: "sommes" },
    { text: " avez perdu votre ballon.", verb: "avez" },
    { text: " a peur des araignées.", verb: "a" },
    { text: " suis le meilleur dresseur de la ville.", verb: "suis" },
    { text: " ont beaucoup de chance.", verb: "ont" },
    { text: " êtes de très bons amis.", verb: "êtes" },
    { text: " est tombé dans une flaque d'eau.", verb: "est" },
    { text: " avons acheté des bonbons.", verb: "avons" },
    { text: " as fait tes devoirs.", verb: "as" },
    { text: " ai gagné la course !", verb: "ai" },
    { text: " sont cachés sous le lit.", verb: "sont" },
    { text: " avez vu un film super hier soir.", verb: "avez" },
    { text: " a couru très vite.", verb: "a" },
    { text: " sommes dans la même classe.", verb: "sommes" },
    { text: " es toujours de bonne humeur.", verb: "es" },
    // Génération automatique des 75 autres pour la diversité
];

// On complète le tableau pour arriver à 100 phrases
const themes = [
    {v: 'a', t: [" a mal à la tête.", " a envie de dormir.", " a oublié son sac.", " a trouvé une carte rare.", " a un beau sourire.", " a mangé une pomme.", " a soif.", " a pris le bus."]},
    {v: 'est', t: [" est devant la maison.", " est très grand.", " est toujours premier.", " est malade aujourd'hui.", " est caché derrière l'arbre.", " est vraiment courageux.", " est rentré tôt.", " est content de son cadeau."]},
    {v: 'ont', t: [" ont un nouveau jeu.", " ont perdu le match.", " ont construit une cabane.", " ont chaud avec le soleil.", " ont ramené un chaton.", " ont pris leurs vélos.", " ont vu un film amusant."]},
    {v: 'sont', t: [" sont dans le jardin.", " sont fiers de leur équipe.", " sont partis en vacances.", " sont très rapides.", " sont amis depuis toujours.", " sont tombés par terre.", " sont prêts à jouer."]},
    {v: 'ai', t: [" ai un secret.", " ai mal au ventre.", " ai soif.", " ai trouvé un trésor.", " ai lu un super livre.", " ai rangé ma chambre.", " ai aidé ma petite sœur."]},
    {v: 'suis', t: [" suis content de te voir.", " suis en vacances.", " suis toujours en avance.", " suis le roi du monde !", " suis allé au cinéma.", " suis dans ma chambre.", " suis tombé dans l'herbe."]},
    {v: 'as', t: [" as une tâche sur ton pull.", " as froid aux mains.", " as vu le match hier ?", " as beaucoup d'amis.", " as pris mon crayon !", " as raison.", " as faim."]},
    {v: 'es', t: [" es mon meilleur ami.", " es très rapide.", " es dans la cour.", " es trop petit pour ce jeu.", " es super fort.", " es prêt pour l'aventure.", " es rentré tard."]},
    {v: 'avons', t: [" avons gagné le tournoi.", " avons fini nos devoirs.", " avons vu un Pikachu.", " avons de la chance.", " avons fait une cabane.", " avons pris le train.", " avons faim."]},
    {v: 'sommes', t: [" sommes contents de jouer.", " sommes devant l'école.", " sommes les champions.", " sommes très fatigués.", " sommes rentrés à la maison.", " sommes prêts à partir.", " sommes en pleine forme."]},
    {v: 'avez', t: [" avez des chaussures neuves.", " avez bien joué.", " avez vu ce film ?", " avez pris la bonne route.", " avez oublié vos affaires.", " avez très chaud.", " avez raison."]},
    {v: 'êtes', t: [" êtes les bienvenus.", " êtes dans le parc.", " êtes très forts.", " êtes fatigués ce soir.", " êtes en avance.", " êtes rentrés tard.", " êtes prêts pour l'école."]}
];

// Fill until 100
let idx = 0;
while (sentencesDB.length < 100) {
    const themeObj = themes[idx % themes.length];
    const phrase = themeObj.t[Math.floor(Math.random() * themeObj.t.length)];
    sentencesDB.push({ text: phrase, verb: themeObj.v });
    idx++;
}

// Variables d'état
let currentSentences = [];
let currentIndex = 0;

function initGame() {
    initDragAndDrop(3); // Type 3 for Game 3
    
    // Pick 10 random sentences
    let shuffled = [...sentencesDB];
    shuffleArray(shuffled);
    currentSentences = shuffled.slice(0, 10);
    currentIndex = 0;
    
    loadSentence();
}

function loadSentence() {
    if (currentIndex >= currentSentences.length) {
        // Victory ! Show modal with 15 points
        showVictoryModal(); // Points will be added automatically by the dragdrop logic
        return;
    }
    
    const sentenceObj = currentSentences[currentIndex];
    document.getElementById('current-sentence-idx').textContent = currentIndex + 1;
    
    // Select correct subject
    const correctSubjects = subjectsByVerb[sentenceObj.verb];
    const correctSubj = correctSubjects[Math.floor(Math.random() * correctSubjects.length)];
    
    // Select 2 incorrect subjects from other verbs
    const allVerbs = Object.keys(subjectsByVerb);
    let incorrectSubjs = [];
    while (incorrectSubjs.length < 2) {
        const randomVerb = allVerbs[Math.floor(Math.random() * allVerbs.length)];
        if (randomVerb !== sentenceObj.verb) {
            const list = subjectsByVerb[randomVerb];
            const badSubj = list[Math.floor(Math.random() * list.length)];
            if (!incorrectSubjs.includes(badSubj)) {
                incorrectSubjs.push(badSubj);
            }
        }
    }
    
    const labels = [correctSubj, ...incorrectSubjs];
    shuffleArray(labels);
    
    // Render
    const sentenceEl = document.getElementById('sentence-text');
    sentenceEl.innerHTML = `<span class="dropzone inline-dropzone" data-expected="${correctSubj}"></span> ${sentenceObj.text}`;
    
    const bankEl = document.getElementById('bank3');
    bankEl.innerHTML = '';
    labels.forEach(label => {
        const el = document.createElement('div');
        el.className = 'label';
        el.textContent = label;
        el.setAttribute('data-value', label);
        bankEl.appendChild(el);
    });
}

// Fonction globale appelée par onPointerUp dans shared.js
window.checkGame3SentenceWin = function() {
    setTimeout(() => {
        currentIndex++;
        loadSentence();
    }, 1000); // 1 sec delay to see the answer
};

document.addEventListener('DOMContentLoaded', initGame);
