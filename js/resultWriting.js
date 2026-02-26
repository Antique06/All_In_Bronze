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

const teams = [
	{ name: 'Gentle Mates', imagePath: 'images/teams/gentle_mates.png' },
	{ name: 'Karmine Corp', imagePath: 'images/teams/karmine_corp.png' },
];

let firebaseUser;
firebase.auth().onAuthStateChanged((user) => {
    firebaseUser = user;
});

const matchsPlace = document.getElementById("matchsPlace");

db.collection("matchs")
    .where("status", "==", "waiting")
    .orderBy("date")
    .orderBy("time")
    .get()
    .then(async (snapshot) => {
        let tournamentId = "";
        for(const doc of snapshot.docs) {
            if(tournamentId != doc.data().tournamentId) {
                tournamentId = doc.data().tournamentId;
                const snapshot2 = await db.collection("tournaments")
                                            .where("tournamentId", "==", tournamentId)
                                            .get()
                snapshot2.forEach((doc2) => {
                    matchsPlace.innerHTML += `<span class="tournamentName"> ` + doc2.data().tournamentName + ` </span>`;
                });
            }
            const team1name = doc.data().team1name;
            const team2name = doc.data().team2name;
            const date = doc.data().date;
            const format = doc.data().format;
            const time = doc.data().time;
            const matchId = doc.data().matchId;

            let team1logo = "images/teams/noLogo.png";
            if(teams.find(t => t.name === team1name)) {
                team1logo = teams.find(t => t.name === team1name).imagePath;
            }
            let team2logo = "images/teams/noLogo.png";
            if(teams.find(t => t.name === team2name)) {
                team2logo = teams.find(t => t.name === team2name).imagePath;
            }

            const halfFormat = Math.ceil(+format[2] / 2)+1;
            
            let team1pronoOption = '';
            for(let i=0; i<halfFormat; i++) {
                team1pronoOption += '<option value ="' + i + '">' + i + "</option>";
            }

            let team2pronoOption = '';
            for(let i=0; i<halfFormat; i++) {
                team2pronoOption += '<option value ="' + i + '">' + i + "</option>";
            }

            matchsPlace.innerHTML+=`<div class="card">
                                        <div class="card__content">
                                            <form class="matchForm" data-match-id=${matchId} data-tournament-id=${tournamentId}>
                                                <img src="${team1logo}" class="team1logo">
                                                <img src="${team2logo}" class="team2logo">
                                                <label class="team1name"> ${team1name} </label>
                                                <label class="team2name"> ${team2name} </label>
                                                <label class="date"> ${date} </label>
                                                <label class="hour"> ${time} </label>
                                                <label class="format"> ${format} </label>
                                                <select class="team1prono selectFormat">
                                                    ${team1pronoOption}
                                                </select>
                                                <select class="team2prono selectFormat">
                                                    ${team2pronoOption}
                                                </select>
                                                <button type="submit" class="submit submitPronoResult"> Enregistrer le résultat </button>
                                            </form>
                                        </div>
                                    </div>`
        }
        const matchForm = document.querySelectorAll(".matchForm").forEach(form => {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const matchId = Number(form.dataset.matchId);
                const tournamentId = Number(form.dataset.tournamentId);
                const team1score = Number(form.querySelector(".team1prono").value);
                const team2score = Number(form.querySelector(".team2prono").value);

                db.collection("matchs")
                    .where("matchId", "==", matchId)
                    .get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            db.collection("matchs").doc(doc.id).update({
                                status: "finished"
                            });
                        });
                    });

                db.collection("matchsResult").add({
                    matchId: matchId,
                    tournamentId: tournamentId,
                    team1score: team1score,
                    team2score: team2score,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                db.collection("predictions")
                    .where("matchId", "==", matchId)
                    .get()
                    .then((snapshot) => {
                        snapshot.forEach((predictionDoc) => {
                            const prediction = predictionDoc.data();
                            const userId = prediction.userId;
                            let pointsEarned = 0;

                            const realWinner = team1score > team2score ? "team1" : (team2score > team1score ? "team2" : "draw");
                            
                            const predictedWinner = prediction.team1score > prediction.team2score ? "team1" : (prediction.team2score > prediction.team1score ? "team2" : "draw");

                            if (prediction.team1score === team1score && prediction.team2score === team2score) {
                                pointsEarned = 3;
                            }
                            else if (realWinner === predictedWinner) {
                                pointsEarned = 1;
                            }

                            const docId = `${userId}_${tournamentId}`;
                            db.collection("userTournamentScores")
                                .doc(docId)
                                .set({
                                    userId: userId,
                                    tournamentId: Number(tournamentId),
                                    score: firebase.firestore.FieldValue.increment(pointsEarned),
                                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                                }, { merge: true });
                        });
                    })
                    .catch((error) => {
                        console.error("Erreur lors du traitement des prédictions : " + error);
                        alert("Erreur lors de l'enregistrement des résultats !");
                    });

                alert("Résultat enregistré et scores mis à jour !");
            });
        });
    });
