const firebaseConfig = {
    apiKey: "AIzaSyCdni2N_G6a5q3jj1qMzc9zqvcveMY1j1U",
    authDomain: "site-prono-a9a7d.firebaseapp.com",
    databaseURL: "https://site-prono-a9a7d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "site-prono-a9a7d",
    storageBucket: "site-prono-a9a7d.firebasestorage.app",
    messagingSenderId: "219604221378",
    appId: "1:219604221378:web:abb9838e1ff541cd0c2a5b",
    measurementId: "G-JWCY1VF0BW"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

window.firebaseUser = null;

window.addUser = function(nom, age, email) {
    db.collection("users").add({
        nom: nom,
        age: age,
        email: email
    })
    .catch((error) => {
        console.error("Erreur :", error);
        alert("Erreur lors de l'ajout de l'utilisateur !");
    });
};

// ===== Home Page Functions =====

// Charger les statistiques globales
async function loadHomeStats() {
    try {
        // Total predictions
        const predictionsSnap = await db.collection('predictions').get();
        document.getElementById('totalPredictions').textContent = predictionsSnap.size;
        
        // Active matches (status = 'waiting')
        const matchesSnap = await db.collection('matchs').where('status', '==', 'waiting').get();
        document.getElementById('activeMatches').textContent = matchesSnap.size;
        
        // Active players (users with predictions)
        const usersSnap = await db.collection('users').get();
        document.getElementById('activePlayers').textContent = usersSnap.size;
        
        // Matches by game
        const valorantSnap = await db.collection('matchs').where('game', '==', 'valorant').where('status', '==', 'waiting').get();
        document.getElementById('valorantMatches').textContent = valorantSnap.size + ' Matchs';
        
        const lolSnap = await db.collection('matchs').where('game', '==', 'lol').where('status', '==', 'waiting').get();
        document.getElementById('lolMatches').textContent = lolSnap.size + ' Matchs';
    } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
    }
}

// Charger les tournois dans le select du leaderboard
async function loadLeaderboardTournaments() {
    const select = document.getElementById('leaderboardTournament');
    if (!select) return;
    
    const snapshot = await db.collection('tournaments').get();
    snapshot.forEach(doc => {
        const data = doc.data();
        const option = document.createElement('option');
        option.value = String(data.tournamentId);
        option.textContent = data.tournamentName;
        select.appendChild(option);
    });
    
    select.addEventListener('change', () => {
        if (select.value) {
            renderHomeLeaderboard(select.value);
        } else {
            document.getElementById('leaderboardPreview').innerHTML = '';
        }
    });
}

// Récupérer username à partir de uid
async function getUsername(uid) {
    const snap = await db.collection('users').where('uid', '==', uid).limit(1).get();
    if (!snap.empty) {
        return snap.docs[0].data().username || snap.docs[0].data().displayName || 'Utilisateur';
    }
    return 'Utilisateur';
}

// helper pour récupérer un snapshot de scores prenant en charge string+number
async function fetchScores(tournamentId, limit = 10) {
    const num = Number(tournamentId);
    const str = String(tournamentId);
    let snap = null;
    if (!isNaN(num)) {
        snap = await db.collection('userTournamentScores')
            .where('tournamentId', '==', num)
            .orderBy('score', 'desc')
            .limit(limit)
            .get();
        console.log(`fetchScores recherche number (${num}) -> ${snap.size} docs`);
    }
    if ((!snap || snap.empty) && str !== '' ) {
        console.log(`fetchScores recherche string (${str})`);
        snap = await db.collection('userTournamentScores')
            .where('tournamentId', '==', str)
            .orderBy('score', 'desc')
            .limit(limit)
            .get();
        console.log(`fetchScores résultat string -> ${snap.size} docs`);
    }
    return snap || { empty: true, docs: [] };
}

// Afficher le leaderboard sur la page d'accueil
async function renderHomeLeaderboard(tournamentId) {
    const container = document.getElementById('leaderboardPreview');
    container.innerHTML = '';

    if (!tournamentId) {
        return;
    }
    console.log('renderHomeLeaderboard called for tournamentId', tournamentId, typeof tournamentId);

    try {
        // Top 5 pour la préview
        const snap = await fetchScores(tournamentId, 5);

        if (snap.empty) {
            container.textContent = 'Aucun score enregistré pour ce tournoi.';
            return;
        }

        const list = document.createElement('ol');
        let rank = 1;
        for (const doc of snap.docs) {
            const data = doc.data();
            const li = document.createElement('li');
            li.setAttribute('data-rank', rank);
            const name = await getUsername(data.userId);
            li.textContent = `${name} – ${data.score} pts`;
            list.appendChild(li);
            rank++;
        }
        container.appendChild(list);

        // Afficher position de l'utilisateur si connecté
        if (window.firebaseUser) {
            const uid = window.firebaseUser.uid;
            const docId = `${uid}_${tournamentId}`;
            const userDoc = await db.collection('userTournamentScores').doc(docId).get();

            if (userDoc.exists) {
                const score = userDoc.data().score || 0;
                const higherSnap = await fetchScores(tournamentId, 1000); // on prend assez large pour calculer position
                let position = 1;
                for (const doc of higherSnap.docs) {
                    if (doc.data().score > score) position++;
                }

                const footer = document.createElement('div');
                footer.className = 'your-rank';
                footer.textContent = `Vous êtes #${position} avec ${score} pts`;
                container.appendChild(footer);
            } else {
                const footer = document.createElement('div');
                footer.className = 'your-rank';
                footer.textContent = `Aucun pronostic pour ce tournoi`;
                container.appendChild(footer);
            }
        }
    } catch (error) {
        console.error('Erreur leaderboard:', error);
        container.textContent = 'Erreur lors du chargement du classement : ' + error.message;
    }
}

// Initialisation de la page d'accueil
window.addEventListener('load', () => {
    loadHomeStats();
    loadLeaderboardTournaments();
});
