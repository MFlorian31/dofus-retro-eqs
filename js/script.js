// 1. DÉFINITION GLOBALE DE LA CLÉ (En haut du fichier)
// Cela permet à TOUTES les fonctions de savoir sur quelle page on est.
const currentPage = window.location.pathname.split("/").pop().replace(".html", "") || "index";
const storageKey = `dofusCraftList_${currentPage}`;

function copyToClipboard(text, element) {
    // On utilise l'API Clipboard moderne
    navigator.clipboard.writeText(text).then(() => {
        // Optionnel : Petit feedback visuel
        const originalText = element.innerText;
        element.innerText = "Copié !";
        element.style.color = "#2ecc71"; // Devient vert

        // On remet le texte d'origine après 1 seconde
        setTimeout(() => {
            element.innerText = originalText;
            element.style.color = ""; // Remet la couleur du CSS
        }, 1000);
    }).catch(err => {
        console.error("Erreur lors de la copie : ", err);
    });
}

// 2. CHARGEMENT INITIAL
let totalCraftingList = JSON.parse(localStorage.getItem(storageKey)) || [];

const itemCrafts = {
    "Coiffe du Bouftou": ["150x Laine de Bouftou", "100x Laine de Boufton Blanc", "40x Laine du Chef de Guerre Bouftou", "1x Cervelle de Bouftou"],
    "Marteau du Bouftou": ["10x Cuir de Bouftou", "1x Sabot de Bouftou", "1x Corne de Bouftou"],
    "Amulette du Bouftou": ["1x Corne de Bouftou", "1x Laine de Bouftou", "1x Cuir de Boufton Blanc"],
    "Anneau de Bouze le Clerc": ["1x Oeil de Bouftou", "1x Dent de Chef de Guerre Bouftou", "1x Oeil de Boufton"],
    "Ceinture du Bouftou": ["50x Laine de Bouftou", "5x Cuir de Boufton Noir", "5x Cuir de Bouftou", "5x Cuir de Boufton Blanc"],
    "Anneau du Sanglier": ["1x Défense de Sanglier", "3x Poils du Sanglier", "1x Groin du Sanglier"],
    "Boufbottes": ["10x Cuir de Boufton Noir", "10x Cuir de Bouftou", "1x Cuir du Chef de Guerre Bouftou", "1x Sabot de Chef de Guerre Bouftou"],
    "Cape Bouffante": ["80x Laine de Bouftou", "30x Laine de Bouftou Blanc", "30x Laine de Boufton Noir", "10x Laine du Chef de Guerre Bouftou", "1x Langue de Chef de Guerre Bouftou"],
    "Excellent Bâton des Rois": ["20x Fer", "16x Cawotte", "12x Bois d'Ebène", "9x Or", "8x Bandeau du Black Tiwabbit"],
    "Amublop Griotte": ["10x Fleur de Blop Griotte", "50x Pollen de Blop", "50x Bout de Blop Griotte", "1x La Reinette", "1x Fleur de Gloutoblop", "1x Feuille de Blop Royal"],
    "La Reinette": ["7x Etain", "2x Bronze", "1x Bois d'Erable", "1x La Destinée Dorée"],
    "La Destinée Dorée": ["4x Cuivre", "2x Manganèse", "2x Bois de Chène"],
    "Blopanneau Griotte": ["10x Fleur de Blop Griotte", "50x Pollen de Blop", "50x Bout de Blop Griotte", "1x Feuille de Blop Royal", "1x Anneau de l Invocateur Satisfait", "1x Fleur de Blopignon"],
    "Anneau de l Invocateur Satisfait": ["4x Manganèse", "1x Kouartz", "1x Ebonite", "1x Kobalite", "1x Anneau de Satisfaction"],
    "Anneau de Satisfaction": ["4x Bois de Noyer", "4x Kobalte", "4x Bois de Châtaignier", "4x Cuivre"],
    "Blopture Griotte": ["10x Fleur de Blop Griotte", "50x Pollen de Blop", "50x Bout de Blop Griotte", "1x Feuille de Blop Royal", "1x Ceinture du Prespic", "1x Fleur de Gloutoblop"],
    "Ceinture du Prespic": ["4x Patte de Prespic", "3x Crinière de Prespic", "1x Pic du Prespic", "1x Queue de Prespic", "1x Estomac de Prespic"],
    "Gelano": ["100x Gelée à la Fraise", "100x Gelée Bleutée", "2x Gelée Citron Royale", "2x Gelée Menthe Royale", "2x Gelée Fraise Royale", "2x Gelée Bleutée Royale"],
    "Bloptes Griottes": ["10x Fleur de Blop Griotte", "50x Pollen de Blop", "50x Bout de Blop Griotte", "1x Feuille de Blop Royal", "1x Pieds du Sanglier", "1x Racine de Tronkoblop"],
    "Pieds du Sanglier": ["2x Cuir de Sanglier", "1x Poils du Sanglier", "1x Groin du Sanglier"],
    "Caracoiffe": ["200x Kokopaille", "150x Carapace Rouge Vide", "150x Carapace Bleue Vide", "150x Carapace Verte Vide", "150x Carapace Jaune Vide", "20x Pot de Gloutovore"],
    "Cape Hôte": ["10x Grand Anneau de Sagesse", "10x Teinture Magique Orange", "8x Poils du Mulou", "2x Mesure de sel", "1x Cocon de Ver à Soie", "1x Poils Darits"],
    "Grand Anneau de Sagesse": ["5x Bronze", "1x Fer"],
    "God Rod": ["12x Or", "5x Bois d'Orme", "4x Bois de Charme", "2x Emeraude", "1x Rubis", "1x Diamant"],
    "Amublop Griotte Royale": ["100x Bout de Blop Griotte", "100x Pollen de Blop", "10x Racine de Tronkoblop", "10x Fleur de Blopignon", "5x Feuille de Blop Royal", "1x Fleur de Blop Griotte Royal", "1x Amublop Griotte"],
    "Blopanneau Griotte Royal": ["100x Bout de Blop Griotte", "100x Pollen de Blop", "10x Racine de Tronkoblop", "10x Fleur de Gloutoblop", "5x Feuille de Blop Royal", "1x Blopanneau Griotte", "1x Fleur de Blop Griotte Royal"],
    "Blopture Griotte Royale": ["100x Pollen de Blop", "100x Bout de Blop Griotte", "10x Racine de Tronkoblop", "10x Fleur de Gloutoblop", "5x Feuille de Blop Royal", "1x Fleur de Blop Griotte Royal", "1x Blopture Griotte"],
    "Bloptes Griottes Royales": ["100x Pollen de Blop", "100x Bout de Blop Griotte", "10x Racine de Tronkoblop", "10x Fleur de Blopignon", "5x Feuille de Blop Royal", "1x Bloptes Griottes", "1x Fleur de Blop Griotte Royal"],  
    "Cape d Elya Wood": ["10x Poils du Milimulou", "10x Poils de Barbe du Grand Pa Wabbit", "10x Poils de Barbe du Bwork Mage", "2x Laine de Bouftou Royal", "1x Poils du Meulou", "1x Etoffe du Meulou", "1x Poils du Minotoror"], 
    "Baguette des Limbes": ["14x Bois d'Orme", "12x Rubis", "12x Bois de Charme", "10x Ambre d'Abraknyde Sombre", "10x Kobalite", "6x Emeraude", "5x Saphir", "5x Diamant"],
    "Amulette Feudala": ["10x Artefact Pandawushu Feu", "10x Bois de Bambou Sacré", "10x Bois de Bambou Sombre", "5x Bois de Bambouto Sacré", "4x Agathe", "2x Ecorce magique de Bulbiflore", "2x Emeraude"],
    "Alliance Feudala": ["10x Artefact Pandawushu Feu", "8x Bois de Bambou Sombre", "6x Aluminite", "5x Bois de Bambou Sacré", "3x Agathe", "1x Aigue-Marine", "1x Pyrute"],
    "Ceinture Feudala": ["20x Bois de Bambou Sombre", "20x Bois de Bambou", "20x Cuir de Porkass", "15x Peau de Pandikaze", "10x Artefact Pandawushu Feu", "5x Peau de Kitsou Nufeu", "1x Etoffe de Pandikaze"],
    "Geta Feudala": ["12x Bois de Bambou", "10x Peau de Kitsou Nufeu", "10x Bois de Bambou Sombre", "10x Artefact Pandawushu Feu", "10x Peau de Cooleuvre", "1x Diamant"],
    "Chapeau Feudala": ["10x Artefact Pandawushu Feu", "9x Peau de Kitsou Nufeu", "5x Peau de Pandikaze", "2x Poils de Kitsou Nae", "2x Poils de Kitsou Nufeu", "1x Saphir", "1x Etoffe de Pandikaze"],
    "Cape Feudala": ["10x Artefact Pandawushu Feu", "5x Poils de Pandikaze", "2x Poils de Kitsou Nere", "2x Poils de Kitsou Nakwa", "2x Poils de Kitsou Nae", "2x Poils de Kitsou Nufeu", "1x Etoffe de Pandikaze"],
    "Médaille Kido": ["10x Aigue-Marine", "9x Pyrute", "8x Rutile", "4x Ambre de Bambouto Sacré", "1x Ecorce magique de Bulbambou", "1x Ecorce magique de Bulbuisson", "1x Ecorce magique de Bulbiflore", "1x Os de Fantôme Léopardo"],
    "Alliance d Elya Wood":["5x Aigue-Marine", "5x Topaze", "5x Agathe", "4x Bois de Bambou Doré", "2x Pyrute", "2x Kryptonite", "2x Rutile", "1x Ecorce magique de Bulbig"],
    "Xénature": ["12x Peau de Kitsou Nufeu", "11x Peau de Kitsou Nere", "6x Peau de Leopardo", "6x Peau de Soryo Firefoux", "3x Etoffe de Kanigrou", "2x Etoffe de Pandikaze", "2x Peau de Pandore", "1x Etoffe de Fantôme Pandikaze"],
    "Bottes Horchons": ["90x Etoffe de Ouassingue", "29x Duvet du Kilibriss", "7x Jus de Ouassingue", "6x Coco du Bitouf sombre", "5x Tourbe séchée de Tourbassingue", "4x Touffe rousse du Flib", "4x Faux menton du Bourbassingue"],
    "Dora Bora": ["100x Feuille de Kokoko", "100x Feuille de Fourbasse", "100x Fleur de Gloutovore", "80x Peau de Trukikol", "80x Tranche de Nodkoko", "10x Trukikol Mort", "5x Noix de Kokoko Traumatisée", "4x Poils de Moon"],
    "Cape Houte": ["30x Poils de Pandikaze", "20x Poils de Kitsou Nufeu", "12x Poils de Soryo Firefoux", "10x Poils de Maho Firefoux", "5x Etoffe de Pandikaze", "1x Etoffe de Soryo Firefoux", "1x Etoffe de Maho Firefoux"],
    "Talisman du Chêne Mou": ["30x L Araknamu", "25x Bourgeon d'Abraknyde Sombre", "10x Ecorce d'Abraknyde Sombre", "5x Bois Envoûté", "5x Racine d'Abraknyde Sombre", "3x Ambre d'Abraknyde Sombre", "2x Ambre du Chêne Mou", "1x Torque Ancestral"],
    "L Araknamu": ["1x Racine d'Abraknyde", "1x Patte d'Arakne", "1x Feuille de Tronknyde", "1x Ambre"],
    "Torque Ancestral": ["150x Ecorce d'Abraknyde", "35x Bourgeon d'Abraknyde Sombre", "30x Bois de Kaliptus", "20x L Araknamu", "5x Ecorce d'Abraknyde Ancestral", "5x Racine d'Abraknyde Ancestral", "1x L Abramu"],
    "L Abramu": ["5x Ecorce d'Abraknyde Sombre", "5x Bourgeon d'Abraknyde Sombre", "5x Racine d'Abraknyde Sombre", "1x Ambre d'Abraknyde Sombre", "1x Ambre d'Abraknyde"],
    "Anneau du Chêne Mou": ["5x Racine du Chêne Mou", "4x Ecorce du Chêne Mou", "3x Bois Envoûté", "1x Anobra", "1x Abranneau Sombre", "1x Abranneau Mou", "1x Ambre du Chêne Mou", "1x Abranneau"],
    "Anobra": ["40x Racine d'Abraknyde", "20x Feuille de Tronknyde", "5x Ambre", "5x Ambre d'Abraknyde", "1x Cale en bois du Tronknyde"],
    "Abranneau Sombre": ["3x Bourgeon d'Abraknyde Sombre", "2x Ecorce d'Abraknyde Sombre", "1x Ambre d'Abraknyde Sombre", "1x Abranneau"],
    "Abranneau Mou": ["10x Bourgeon d'Abraknyde", "10x Ecorce d'Abraknyde Sombre", "10x Ecorce d'Abraknyde", "1x Ambre d'Abraknyde Sombre", "1x Ambre d'Abraknyde"],
    "Abranneau": ["4x Bourgeon d'Abraknyde", "4x Ecorce d'Abraknyde", "1x Ambre d'Abraknyde"],
    "String Automnal du Chêne Mou": ["130x Ambre d'Abraknyde", "50x Bourgeon d'Abraknyde Sombre", "25x Ecorce d'Abraknyde Sombre", "20x Racine d'Abraknyde Sombre", "9x Ecorce du Chêne Mou", "8x Racine du Chêne Mou", "1x Abrature Ancestrale", "1x Abrature"],
    "Abrature Ancestrale": ["30x Bourgeon d'Abraknyde Sombre", "25x Bois de Tronknyde", "10x Racine d'Abraknyde Sombre", "10x Ecorce d'Abraknyde Sombre", "4x Ambre Ancestrale", "1x Abrature", "1x Bois Ancestral"],
    "Abrature": ["20x Racine d'Abraknyde", "10x Ecorce d'Abraknyde", "10x Bourgeon d'Abraknyde", "1x Ambre", "1x Bois de Tronknyde"],
    "Tongues du Dimanche du Chêne Mou": ["40x Bois de Kaliptus", "35x Bourgeon d'Abraknyde Sombre", "25x Ecorce d'Abraknyde Sombre", "20x Racine d'Abraknyde Sombre", "4x Racine du Chêne Mou", "3x Ecorce du Chêne Mou", "1x Abrabottes", "1x Protège Tibias Ancestraux"],
    "Abrabottes": ["25x Feuille de Tronknyde", "20x Bourgeon d'Abraknyde", "20x Racine d'Abraknyde", "10x Ecorce d'Abraknyde", "1x Bois de Tronknyde"],
    "Protège Tibias Ancestraux": ["20x Bois de Kaliptus", "10x Ecorce d'Abraknyde Sombre", "10x Bois d'Orme", "10x Racine d'Abraknyde Sombre", "3x Ambre Ancestrale", "2x Ecorce d'Abraknyde Ancestral", "1x Abrabottes"],
    "Coiffe du Chêne Mou": ["10x Champignon Luidegît", "10x Ambre d'Abraknyde Sombre", "10x Racine du Chêne Mou", "10x Ecorce du Chêne Mou", "2x Ambre du Chêne Mou", "1x Abracaska Ancestral", "1x Abracaska", "1x Bourgeon du Chêne Mou"],
    "Abracaska Ancestral": ["120x Racine d'Abraknyde", "20x Bourgeon d'Abraknyde Sombre", "3x Racine d'Abraknyde Ancestral", " 3x Ecorce d'Abraknyde Ancestral", "2x Racine d'Abraknyde Sombre", "1x Abracaska", "1x Ambre Ancestrale"],
    "Abracaska": ["60x Bourgeon d'Abraknyde", "40x Racine d'Abraknyde", "20x Ecorce d'Abraknyde", "15x Ambre", "3x Bois de Tronknyde"],
    "Cape Usée du Chêne Mou": ["200x Ambre", "5x Ambre d'Abraknyde Sombre", "5x Ecorce du Chêne Mou", "4x Racine du Chêne Mou", "1x Abracapa Ancestrale", "1x Bourgeon du Chêne Mou", "1x Abracape", "1x Abracapa"],
    "Abracapa Ancestrale": ["150x Racine d'Abraknyde", "45x Bois de Bambou Sombre", "3x Ecorce d'Abraknyde Ancestral", "2x Racine d'Abraknyde Ancestral", "1x Abracape", "1x Abracapa", "1x Bourgeon de l'Abraknyde Ancestral"],
    "Abracapa": ["30x Bourgeon d'Abraknyde", "30x Racine d'Abraknyde", "30x Ecorce d'Abraknyde", "5x Ambre", "3x Sève d'Abraknyde"],
    "Abracape": ["10x Abranneau", "10x Bourgeon d'Abraknyde", "10x Ecorce d'Abraknyde"],
    "Collier du Minotoror": ["20x Poil de Renarbo", "13x Ambre de Bambouto Sacré", "10x Poils du Minotoror", "5x Laine du Minotoror", "1x Queue de Minotoror", "1x Cuir de Minotoror", "1x Collier Cassé d'Ouginak"],
    "Collier du Minotot": ["30x Ailes du Scarabosse Doré", "30x Ailes de Scarafeuille Noir", "25x Saphir", "25x Rubis", "15x Rutile", "1x Collier du Minotoror", "1x Pierre du Koulosse", "1x Corne du Minotot"],
    "Bracelet du Minotot": ["60x Carapace de Scaratos", "30x Carapace de Scarafeuille Noir", "16x Pyrute", "3x Carapace du Scarabosse Doré", "1x Anneau du Minotoror", "1x Fémur du Minotot", "1x Méga Pierre du Craqueleur Légendaire"],
    "Anneau du Minotoror": ["30x Dent de Dragodinde", "20x Poil de Gamino", "9x Rubis", "5x Poil de Déminoboule", "4x Laine du Minotoror", "1x Corne Brûlée du Minotoror", "1x Fémur de Koalak Farouche"],
    "Ceinture du Minotot": ["25x Poil de Renarbo", "12x Peau de Chevaucheur Koalak", "8x Laine du Minotoror", "3x Cuir de Minotoror", "1x Ceinture du Minotoror", "1x Etoffe de Maître Pandore", "1x Cuir du Minotot", "1x Laine du Minotot"],
    "Ceinture du Minotoror": ["80x Peau de Kraméléhon", "75x Peau de Minoskito", "8x Peau de Dragueuse", "5x Peau de Don Dorgan", "4x Laine du Minotoror", "2x Peau de Drakoalak", "1x Cuir de Minotoror"],
    "Sandales du Minotot": ["30x Peau de Drakoalak", "25x Peau de Maître Koalak", "10x Peau de Bworkette", "1x Bottes Animales Sombres", "1x Sabot du Minotot", "1x Bottes Animales", "1x Bottes du Minotoror", "1x Cuir du Minotot"],
    "Bottes Animales Sombres": ["30x Or", "20x Poil de Kanigrou", "20x Poil d'Ouginak", "10x Teinture Magique Sombre", "2x Sabot du Minotoror", "1x Queue de Minotoror", "1x Cuir de Minotoror", "1x Poils du Minotoror"],
    "Bottes Animales": ["30x Or", "30x Carapace de Scarafeuille Rouge", "20x Poil d'Ouginak", "20x Cuir de Sanglier des Plaines", "20x Cuir de Porkass", "20x Poil de Kanigrou", "1x Sabot du Minotoror"],
    "Bottes du Minotoror": ["120x Peau de Minoskito", "100x Peau de Kraméléhon", "15x Peau de Piralak", "9x Laine de Bouftou Royal", "4x Laine du Minotoror", "2x Cuir de Minotoror", "1x Sabot du Minotoror"],
    "Coiffe du Minotot": ["21x Poil de Peki", "15x Plume de Tofu Royal", "5x Poil de Skeunk", "3x Etoffe du Wa Wabbit", "3x Etoffe de Fantôme Pandore", "1x Minotokorno", "1x Corne du Minotot", "1x Laine du Minotot"],
    "Minotokorno": ["2x Corne Brulée du Minotoror", "1x Poils du Minotoror", "1x Poils de souris", "1x Poils du Sanglier", "1x Ficelle en Lin"],
    "Cape du Minotot": ["100x Poil de Gamino", "15x Laine du Minotoror", "15x Poil de Mominotor", "15x Poil de Déminoboule", "10x Poil du Wa Wabbit", "1x Cape du Minotoror", "1x Laine du Minotot", "1x Poil de Maître Pandore"],
    "Cape du Minotoror": ["40x Poil de Gamino", "25x Poils du Minotoror", "8x Poil de Déminoboule", "8x Poil de Renarbo", "6x Laine de Minotoror", "2x Poils de Barbe du Warko Marron", "2x Poils de Barbe du Warko Violet"],
};

function addToCraft(itemName, event) {
    if(event) event.stopPropagation();

    // On cherche si l'item est déjà dans la liste
    const existingCraft = totalCraftingList.find(item => item.parentName === itemName);
    if (existingCraft) {
        // Au lieu de demander si on en ajoute un deuxième, on propose d'augmenter la quantité
        const addMore = confirm(`"${itemName}" est déjà dans la liste. Voulez-vous en crafter un exemplaire de plus ?`);
        if (addMore) {
            existingCraft.multiplier = (existingCraft.multiplier || 1) + 1;
            saveAndRender();
        }
        return;
    }

    const ingredientsRaw = itemCrafts[itemName];
    if (!ingredientsRaw) return;

    const ingredients = ingredientsRaw.map(ing => {
        const parts = ing.split('x ');
        return {
            qtyRequired: parseInt(parts[0]) || 0,
            qtyOwned: 0,
            name: parts[1] || ing
        };
    });

    totalCraftingList.push({
        id: Date.now(), 
        parentName: itemName,
        ingredients: ingredients,
        multiplier: 1 // Quantité d'items à crafter par défaut
    });

    saveAndRender();
}

// NOUVELLE FONCTION : Pour changer le nombre d'items à crafter
function updateMultiplier(itemIdx, value) {
    const qty = parseInt(value) || 1;
    totalCraftingList[itemIdx].multiplier = qty;
    saveAndRender();
}

// MODIFICATION : Rendre la liste avec le multiplicateur
function renderCraftList() {
    const listElement = document.getElementById('ingredient-list');
    const placeholder = document.getElementById('craft-placeholder');
    if (!listElement) return;

    if (totalCraftingList.length === 0) {
        placeholder.style.display = "block";
        listElement.innerHTML = "";
        return;
    }

    placeholder.style.display = "none";
    listElement.innerHTML = "";

    totalCraftingList.forEach((craft, itemIdx) => {
        const card = document.createElement('div');
        card.className = 'craft-card';
        
        const mult = craft.multiplier || 1;

        let ingredientsHTML = craft.ingredients.map((ing, ingIdx) => {
            const totalNeeded = ing.qtyRequired * mult; // MULTIPLICATION ICI
            const isDone = ing.qtyOwned >= totalNeeded;
            
            const isCraftable = itemCrafts[ing.name]; 
            const craftBtn = isCraftable ? 
                `<span class="sub-craft-btn" title="Ajouter la recette" onclick="addToCraft('${ing.name}', event)">+</span>` 
                : '';

            return `
            <div class="ing-row ${isDone ? 'completed' : ''}">
                <span class="ing-name">${craftBtn} ${ing.name}</span>
                <div class="ing-controls">
                    <input type="number" value="${ing.qtyOwned}" min="0" 
                        onchange="updateOwned(${itemIdx}, ${ingIdx}, this.value)">
                    <span class="qty-total">/ ${totalNeeded}</span>
                </div>
            </div>`;
        }).join('');

        card.innerHTML = `
            <div class="card-header">
                <div class="header-left">
                    <strong>${craft.parentName}</strong>
                    <div class="multiplier-container">
                        x <input type="number" class="mult-input" value="${mult}" min="1" 
                            onchange="updateMultiplier(${itemIdx}, this.value)">
                    </div>
                </div>
                <span class="remove-card" style="cursor:pointer" onclick="removeCraftItem(${craft.id})">✕</span>
            </div>
            <div class="card-body">${ingredientsHTML}</div>`;
        listElement.appendChild(card);
    });
}

function updateOwned(itemIndex, ingIndex, value) {
    totalCraftingList[itemIndex].ingredients[ingIndex].qtyOwned = parseInt(value) || 0;
    saveAndRender();
}

function removeCraftItem(id) {
    totalCraftingList = totalCraftingList.filter(item => item.id !== id);
    saveAndRender();
}

function clearCraft() {
    if(confirm("Vider toute la liste ?")) {
        totalCraftingList = [];
        saveAndRender();
    }
}

function saveAndRender() {
    // Sauvegarde avec la clé spécifique à la page
    localStorage.setItem(storageKey, JSON.stringify(totalCraftingList));
    renderCraftList();
    renderTotalResources();
}

function renderTotalResources() {
    const totalContainer = document.getElementById('total-resources-container');
    if (!totalContainer) return;
    
    if (totalCraftingList.length === 0) {
        totalContainer.innerHTML = "";
        return;
    }

    const totals = {};
    totalCraftingList.forEach(item => {
        const mult = item.multiplier || 1; // On récupère le multiplicateur
        item.ingredients.forEach(ing => {
            if (!totals[ing.name]) totals[ing.name] = { owned: 0, required: 0 };
            totals[ing.name].owned += (parseInt(ing.qtyOwned) || 0);
            totals[ing.name].required += (ing.qtyRequired * mult); // MULTIPLICATION ICI
        });
    });
    let html = `<div class="total-resources-card"><h3>Total des ressources à récolter</h3><div class="resources-grid">`;
    for (const [name, data] of Object.entries(totals)) {
        const isDone = data.owned >= data.required;
        const percent = Math.min((data.owned / data.required) * 100, 100);
        html += `
            <div class="total-item ${isDone ? 'all-done' : ''}">
                <div class="total-info">
                    <span class="res-name">${name}</span>
                    <span class="res-qty">${data.owned} / ${data.required}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%"></div></div>
            </div>`;
    }
    totalContainer.innerHTML = html + `</div></div>`;
}

function renderCraftList() {
    const listElement = document.getElementById('ingredient-list');
    const placeholder = document.getElementById('craft-placeholder');
    if (!listElement) return;

    if (totalCraftingList.length === 0) {
        placeholder.style.display = "block";
        listElement.innerHTML = "";
        return;
    }

    placeholder.style.display = "none";
    listElement.innerHTML = "";

    totalCraftingList.forEach((craft, itemIdx) => {
        const card = document.createElement('div');
        card.className = 'craft-card';
        
        const mult = craft.multiplier || 1;

        let ingredientsHTML = craft.ingredients.map((ing, ingIdx) => {
            const totalNeeded = ing.qtyRequired * mult; // MULTIPLICATION ICI
            const isDone = ing.qtyOwned >= totalNeeded;
            
            const isCraftable = itemCrafts[ing.name]; 
            const craftBtn = isCraftable ? 
                `<span class="sub-craft-btn" title="Ajouter la recette" onclick="addToCraft('${ing.name}', event)">+</span>` 
                : '';

            return `
            <div class="ing-row ${isDone ? 'completed' : ''}">
                <span class="ing-name">${craftBtn} ${ing.name}</span>
                <div class="ing-controls">
                    <input type="number" value="${ing.qtyOwned}" min="0" 
                        onchange="updateOwned(${itemIdx}, ${ingIdx}, this.value)">
                    <span class="qty-total">/ ${totalNeeded}</span>
                </div>
            </div>`;
        }).join('');

        card.innerHTML = `
            <div class="card-header">
                <strong class="item-name">${craft.parentName}</strong>
                <div class="header-right">
                    <div class="multiplier-container">
                        <span class="mult-prefix">x</span>
                        <input type="number" class="mult-input" value="${mult}" min="1" 
                            onchange="updateMultiplier(${itemIdx}, this.value)">
                    </div>
                    <span class="remove-card" onclick="removeCraftItem(${craft.id})">✕</span>
                </div>
            </div>
            <div class="card-body">${ingredientsHTML}</div>`;
        listElement.appendChild(card);
    });
}

window.onload = () => {
    renderCraftList();
    renderTotalResources();
};