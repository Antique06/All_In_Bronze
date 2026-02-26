<<<<<<< HEAD
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
    { name: 'All Gamers', imagePath: 'images/teams/all_gamers.png'},
    { name: 'BBL Esport', imagePath: 'images/teams/bbl_esport.png'},
    { name: 'EDward Gaming', imagePath: 'images/teams/edward_gaming.png'},
    { name: 'Fnatic', imagePath: 'images/teams/fnatic.png'},
    { name: 'Furia', imagePath: 'images/teams/furia.png'},
    { name: 'G2 Esport', imagePath: 'images/teams/g2_esport.png'},
    { name: 'Gentle Mates', imagePath: 'images/teams/gentle_mates.png' },
    { name: 'GiantX', imagePath: 'images/teams/giantx.png'},
    { name: 'Karmine Corp', imagePath: 'images/teams/karmine_corp.png' },
    { name: 'Movistar Koi', imagePath: 'images/teams/movistar_koi.png'},
    { name: 'Natus Vincere', imagePath: 'images/teams/natus_vincere.png'},
    { name: 'NRG', imagePath: 'images/teams/nrg.png'},
    { name: 'Nongshim RedForce', imagePath: 'images/teams/ns_redforce.png'},
    { name: 'Paper Rex', imagePath: 'images/teams/paper_rex.png'},
    { name: 'Shifters', imagePath: 'images/teams/shifters.png'},
    { name: 'SK Gaming', imagePath: 'images/teams/sk_gaming.png'},
    { name: 'T1', imagePath: 'images/teams/t1.png'},
    { name: 'Team Heretics', imagePath: 'images/teams/team_heretics.png'},
    { name: 'Team Liquid', imagePath: 'images/teams/team_liquid.png'},
    { name: 'Team Vitality', imagePath: 'images/teams/team_vitality.png'},
    { name: 'XLG Esport', imagePath: 'images/teams/xlg_esport.png'},
];

let firebaseUser;
firebase.auth().onAuthStateChanged((user) => {
    firebaseUser = user;
});

const matchsPlace = document.getElementById("matchsPlace");

db.collection("matchs")
    .where("game", "==", "valorant")
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


            let contenuSubmit = 'Valider le Pronostic';
            let classSubmitProno = 'submitPronoValider';
            let pronoTeam1Score = 0;
            let pronoTeam2Score = 0;
            if (firebaseUser) {
                const userId = firebaseUser.uid;
                const snapshot3 = await db.collection("predictions")
                                            .where("matchId", "==", matchId)
                                            .where("userId", "==", userId)
                                            .get()
                if(!snapshot3.empty) {
                    contenuSubmit = 'Modifier le Pronostic';
                    classSubmitProno = 'submitPronoModifier';
                    const doc = snapshot3.docs[0];
                    pronoTeam1Score = doc.data().team1score;
                    pronoTeam2Score = doc.data().team2score;
                }
            }

            let team1pronoOption = '';
            for(let i=0; i<halfFormat; i++) {
                if(i===pronoTeam1Score) {
                    team1pronoOption += '<option value ="' + i + '" selected>' + i + "</option>";
                } else {
                    team1pronoOption += '<option value ="' + i + '">' + i + "</option>";
                }
            }

            let team2pronoOption = '';
            for(let i=0; i<halfFormat; i++) {
                if(i===pronoTeam2Score) {
                    team2pronoOption += '<option value ="' + i + '" selected>' + i + "</option>";
                } else {
                    team2pronoOption += '<option value ="' + i + '">' + i + "</option>";
                }
            }

            let selectSubmitTeam1 = `<select class="team1prono selectFormat">`
                                        + team1pronoOption +
                                    `</select>`;
            let selectSubmitTeam2 = `<select class="team2prono selectFormat">`
                                        + team2pronoOption +
                                    `</select>`;
            let buttonSubmit = `<button type="submit" class="submit ` + classSubmitProno + `">` + contenuSubmit + `</button>`;

            const matchDate = new Date(date + 'T' + time);
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - (60*60*1000));
            if(matchDate<oneHourAgo) { 
                selectSubmitTeam1 = `<span class="team1prono spanTeam1prono">${pronoTeam1Score}</span>`;
                selectSubmitTeam2 = `<span class="team2prono spanTeam2prono">${pronoTeam2Score}</span>`;
                buttonSubmit = `<span class="submit spanSubmit"> En attente du résultat </span>`;
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
                                                ${selectSubmitTeam1}
                                                ${selectSubmitTeam2}
                                                ${buttonSubmit}
                                            </form>
                                        </div>
                                    </div>`
        }
        document.querySelectorAll(".matchForm").forEach(form => {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const matchId = Number(form.dataset.matchId);
                const tournamentId = Number(form.dataset.tournamentId);
                const team1score = Number(form.querySelector(".team1prono").value);
                const team2score = Number(form.querySelector(".team2prono").value);
                let userId = "";
                if (firebaseUser) {
                    userId = firebaseUser.uid;
                    db.collection("predictions")
                        .where("matchId", "==", matchId)
                        .where("userId", "==", userId)
                        .get()
                        .then((snapshot) => {
                            if(snapshot.empty) {
                                db.collection("predictions").add({
                                    matchId: matchId,
                                    tournamentId: tournamentId,
                                    userId: userId,
                                    team1score: team1score,
                                    team2score: team2score,
                                })
                                .then(() => {
                                    alert("Votre prediction a bien été prise en compte !");
                                    location.reload();
                                })
                                .catch((error) => {
                                    console.error("Erreur ajout prono :", error);
                                    alert("Erreur lors de l'ajout du pronostic !");
                                });
                            } else {
                                const docId = snapshot.docs[0].id;
                                db.collection("predictions").doc(docId).update({
                                    team1score: team1score,
                                    team2score: team2score,
                                })
                                .then(() => {
                                    alert("Votre prediction a bien été mise à jour !");
                                    location.reload();
                                })
                                .catch((error) => {
                                    console.error("Erreur modif prono :", error);
                                    alert("Erreur lors de la modification du pronostic !");
                                });
                            }
                        })
                        .catch((error) => {
                            console.error("Erreur recherche :", error);
                            alert("Erreur lors de la vérification de l'existance d'un pronostic !")
                        });
                } else {
                    alert("Vous devez être connecté pour enregistrer un pronostic !");
                    return;
                }
            });
        });
    });
=======
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
    { name: 'All Gamers', imagePath: 'images/teams/all_gamers.png'},
    { name: 'BBL Esport', imagePath: 'images/teams/bbl_esport.png'},
    { name: 'EDward Gaming', imagePath: 'images/teams/edward_gaming.png'},
    { name: 'Fnatic', imagePath: 'images/teams/fnatic.png'},
    { name: 'Furia', imagePath: 'images/teams/furia.png'},
    { name: 'G2 Esport', imagePath: 'images/teams/g2_esport.png'},
    { name: 'Gentle Mates', imagePath: 'images/teams/gentle_mates.png' },
    { name: 'GiantX', imagePath: 'images/teams/giantx.png'},
    { name: 'Karmine Corp', imagePath: 'images/teams/karmine_corp.png' },
    { name: 'Movistar Koi', imagePath: 'images/teams/movistar_koi.png'},
    { name: 'Natus Vincere', imagePath: 'images/teams/natus_vincere.png'},
    { name: 'NRG', imagePath: 'images/teams/nrg.png'},
    { name: 'Nongshim RedForce', imagePath: 'images/teams/ns_redforce.png'},
    { name: 'Paper Rex', imagePath: 'images/teams/paper_rex.png'},
    { name: 'Shifters', imagePath: 'images/teams/shifters.png'},
    { name: 'SK Gaming', imagePath: 'images/teams/sk_gaming.png'},
    { name: 'T1', imagePath: 'images/teams/t1.png'},
    { name: 'Team Heretics', imagePath: 'images/teams/team_heretics.png'},
    { name: 'Team Liquid', imagePath: 'images/teams/team_liquid.png'},
    { name: 'Team Vitality', imagePath: 'images/teams/team_vitality.png'},
    { name: 'XLG Esport', imagePath: 'images/teams/xlg_esport.png'},
];

let firebaseUser;
firebase.auth().onAuthStateChanged((user) => {
    firebaseUser = user;
});

const matchsPlace = document.getElementById("matchsPlace");

db.collection("matchs")
    .where("game", "==", "valorant")
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


            let contenuSubmit = 'Valider le Pronostic';
            let classSubmitProno = 'submitPronoValider';
            let pronoTeam1Score = 0;
            let pronoTeam2Score = 0;
            if (firebaseUser) {
                const userId = firebaseUser.uid;
                const snapshot3 = await db.collection("predictions")
                                            .where("matchId", "==", matchId)
                                            .where("userId", "==", userId)
                                            .get()
                if(!snapshot3.empty) {
                    contenuSubmit = 'Modifier le Pronostic';
                    classSubmitProno = 'submitPronoModifier';
                    const doc = snapshot3.docs[0];
                    pronoTeam1Score = doc.data().team1score;
                    pronoTeam2Score = doc.data().team2score;
                }
            }

            let team1pronoOption = '';
            for(let i=0; i<halfFormat; i++) {
                if(i===pronoTeam1Score) {
                    team1pronoOption += '<option value ="' + i + '" selected>' + i + "</option>";
                } else {
                    team1pronoOption += '<option value ="' + i + '">' + i + "</option>";
                }
            }

            let team2pronoOption = '';
            for(let i=0; i<halfFormat; i++) {
                if(i===pronoTeam2Score) {
                    team2pronoOption += '<option value ="' + i + '" selected>' + i + "</option>";
                } else {
                    team2pronoOption += '<option value ="' + i + '">' + i + "</option>";
                }
            }

            let selectSubmitTeam1 = `<select class="team1prono selectFormat">`
                                        + team1pronoOption +
                                    `</select>`;
            let selectSubmitTeam2 = `<select class="team2prono selectFormat">`
                                        + team2pronoOption +
                                    `</select>`;
            let buttonSubmit = `<button type="submit" class="submit ` + classSubmitProno + `">` + contenuSubmit + `</button>`;

            const matchDate = new Date(date + 'T' + time);
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - (60*60*1000));
            if(matchDate<oneHourAgo) { 
                selectSubmitTeam1 = `<span class="team1prono spanTeam1prono">${pronoTeam1Score}</span>`;
                selectSubmitTeam2 = `<span class="team2prono spanTeam2prono">${pronoTeam2Score}</span>`;
                buttonSubmit = `<span class="submit spanSubmit"> En attente du résultat </span>`;
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
                                                ${selectSubmitTeam1}
                                                ${selectSubmitTeam2}
                                                ${buttonSubmit}
                                            </form>
                                        </div>
                                    </div>`
        }
        document.querySelectorAll(".matchForm").forEach(form => {
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                const matchId = Number(form.dataset.matchId);
                const tournamentId = Number(form.dataset.tournamentId);
                const team1score = Number(form.querySelector(".team1prono").value);
                const team2score = Number(form.querySelector(".team2prono").value);
                let userId = "";
                if (firebaseUser) {
                    userId = firebaseUser.uid;
                    db.collection("predictions")
                        .where("matchId", "==", matchId)
                        .where("userId", "==", userId)
                        .get()
                        .then((snapshot) => {
                            if(snapshot.empty) {
                                db.collection("predictions").add({
                                    matchId: matchId,
                                    tournamentId: tournamentId,
                                    userId: userId,
                                    team1score: team1score,
                                    team2score: team2score,
                                })
                                .then(() => {
                                    alert("Votre prediction a bien été prise en compte !");
                                    location.reload();
                                })
                                .catch((error) => {
                                    console.error("Erreur ajout prono :", error);
                                    alert("Erreur lors de l'ajout du pronostic !");
                                });
                            } else {
                                const docId = snapshot.docs[0].id;
                                db.collection("predictions").doc(docId).update({
                                    team1score: team1score,
                                    team2score: team2score,
                                })
                                .then(() => {
                                    alert("Votre prediction a bien été mise à jour !");
                                    location.reload();
                                })
                                .catch((error) => {
                                    console.error("Erreur modif prono :", error);
                                    alert("Erreur lors de la modification du pronostic !");
                                });
                            }
                        })
                        .catch((error) => {
                            console.error("Erreur recherche :", error);
                            alert("Erreur lors de la vérification de l'existance d'un pronostic !")
                        });
                } else {
                    alert("Vous devez être connecté pour enregistrer un pronostic !");
                    return;
                }
            });
        });
    });
>>>>>>> 329f3506195e750c337ff8a266ea732b7c44a560
