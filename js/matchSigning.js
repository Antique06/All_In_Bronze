<<<<<<< HEAD
const addMatchForm = document.getElementById('addMatchForm');
const preTeams1 = document.getElementById('preTeams1');
const preTeams2 = document.getElementById('preTeams2');
const formTeam1Name = document.getElementById('formTeam1Name');
const formTeam2Name = document.getElementById('formTeam2Name');

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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const selectTournament = document.getElementById("selectTournament");
const selectGame = document.getElementById("formGame");

addMatchForm.addEventListener("submit", handleAddMatch)

function handleAddMatch(e) {
    e.preventDefault();
    let matchId = (Date.now() / (Math.random()*Math.random()) + Math.random());
    matchId = Math.round(matchId);
    const game = document.getElementById("formGame").value;
    let team1name = document.getElementById("preTeams1").value;
    if(team1name==="autre") {
        team1name = document.getElementById("formTeam1Name").value;
    }
    let team2name = document.getElementById("preTeams2").value;
    if(team2name==="autre") {
        team2name = document.getElementById("formTeam2Name").value;
    }
    const format = document.getElementById("formFormat").value;
    const date = document.getElementById("formDate").value;
    const time = document.getElementById("formTime").value;
    const status = "waiting";

    
    let tournament = document.getElementById("selectTournament").value;
    let tournamentId = parseInt(tournament, 10);
    if(tournament==="autre") {
        tournamentId = (Date.now() / (Math.random()*Math.random()) + Math.random());
        tournamentId = Math.round(tournamentId);
        tournament = document.getElementById("inputTournament").value;
        addTournament(tournamentId, tournament, game);
    }

    addMatch(matchId, game, tournamentId, team1name, team2name, format, date, time, status);
}

function addMatch(matchId, game, tournamentId, team1name, team2name, format, date, time, status) {
    db.collection("matchs").add({
        matchId: matchId,
        game: game,
        tournamentId: tournamentId,
        team1name: team1name,
        team2name: team2name,
        format: format,
        date: date,
        time: time,
        status: status,
    })
    .then(() => {
        addMatchForm.reset();
        document.getElementById("imgTeam1").setAttribute("src", 'images/teams/noLogo.png');
        document.getElementById("imgTeam2").setAttribute("src", 'images/teams/noLogo.png');
        formTeam1Name.setAttribute("style", "");
        formTeam2Name.setAttribute("style", "");
        modifSelectTournament("valorant");
    })
    .catch((error) => {
        console.error("Erreur :", error);
        alert("Erreur lors de l'ajout du match !");
    });
}

function addTournament(tournamentId, tournamentName, game) {
    db.collection("tournaments").add({
        tournamentId: tournamentId,
        tournamentName: tournamentName,
        game: game,
    })
    .catch((error) => {
        console.error("Erreur :", error);
        alert("Erreur lors de l'ajout du tournoi !");
    });
}

teams.forEach((item) => {
    preTeams1.innerHTML += '<option value="' + item.name + '"> ' + item.name + ' </option>';
});
preTeams1.addEventListener("change", function() {
    const value = this.value;
    const img = document.getElementById("imgTeam1");
    if(value==="autre") {
        img.setAttribute("src", 'images/teams/noLogo.png');
        formTeam1Name.setAttribute("style", "");
    } else {
        const team = teams.find(t => t.name === value);
        img.setAttribute("src", team.imagePath);
        formTeam1Name.setAttribute("style", "display: none;");
    }
});

teams.forEach((item) => {
    preTeams2.innerHTML += '<option value="' + item.name + '"> ' + item.name + ' </option>';
});
preTeams2.addEventListener("change", function() {
    const value = this.value;
    const img = document.getElementById("imgTeam2");
    if(value==="autre") {
        img.setAttribute("src", 'images/teams/noLogo.png');
        formTeam2Name.setAttribute("style", "");
    } else {
        const team = teams.find(t => t.name === value);
        img.setAttribute("src", team.imagePath);
        formTeam2Name.setAttribute("style", "display: none;");
    }
});

function modifSelectTournament(game) {
    db.collection("tournaments")
        .where("game", "==", game)
        .orderBy("tournamentName")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                selectTournament.innerHTML += '<option value="' + doc.data().tournamentId + '">' + doc.data().tournamentName + '</option>';
            });
        });
}

selectTournament.addEventListener("change", function() {
    const value = this.value;
    const input = document.getElementById("inputTournament");
    if(value=="autre") {
        input.setAttribute("style", "");
    } else {
        input.setAttribute("style", "display: none;");
    }
});

selectGame.addEventListener("change", function() {
    const value = this.value;
    selectTournament.innerHTML = '<option value="autre"> Autre (à renseigner manuellement) </option>';
    modifSelectTournament(value);
});

modifSelectTournament("valorant");
=======
const addMatchForm = document.getElementById('addMatchForm');
const preTeams1 = document.getElementById('preTeams1');
const preTeams2 = document.getElementById('preTeams2');
const formTeam1Name = document.getElementById('formTeam1Name');
const formTeam2Name = document.getElementById('formTeam2Name');

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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const selectTournament = document.getElementById("selectTournament");
const selectGame = document.getElementById("formGame");

addMatchForm.addEventListener("submit", handleAddMatch)

function handleAddMatch(e) {
    e.preventDefault();
    let matchId = (Date.now() / (Math.random()*Math.random()) + Math.random());
    matchId = Math.round(matchId);
    const game = document.getElementById("formGame").value;
    let team1name = document.getElementById("preTeams1").value;
    if(team1name==="autre") {
        team1name = document.getElementById("formTeam1Name").value;
    }
    let team2name = document.getElementById("preTeams2").value;
    if(team2name==="autre") {
        team2name = document.getElementById("formTeam2Name").value;
    }
    const format = document.getElementById("formFormat").value;
    const date = document.getElementById("formDate").value;
    const time = document.getElementById("formTime").value;
    const status = "waiting";

    
    let tournament = document.getElementById("selectTournament").value;
    let tournamentId = parseInt(tournament, 10);
    if(tournament==="autre") {
        tournamentId = (Date.now() / (Math.random()*Math.random()) + Math.random());
        tournamentId = Math.round(tournamentId);
        tournament = document.getElementById("inputTournament").value;
        addTournament(tournamentId, tournament, game);
    }

    addMatch(matchId, game, tournamentId, team1name, team2name, format, date, time, status);
}

function addMatch(matchId, game, tournamentId, team1name, team2name, format, date, time, status) {
    db.collection("matchs").add({
        matchId: matchId,
        game: game,
        tournamentId: tournamentId,
        team1name: team1name,
        team2name: team2name,
        format: format,
        date: date,
        time: time,
        status: status,
    })
    .then(() => {
        addMatchForm.reset();
        document.getElementById("imgTeam1").setAttribute("src", 'images/teams/noLogo.png');
        document.getElementById("imgTeam2").setAttribute("src", 'images/teams/noLogo.png');
        formTeam1Name.setAttribute("style", "");
        formTeam2Name.setAttribute("style", "");
        modifSelectTournament("valorant");
    })
    .catch((error) => {
        console.error("Erreur :", error);
        alert("Erreur lors de l'ajout du match !");
    });
}

function addTournament(tournamentId, tournamentName, game) {
    db.collection("tournaments").add({
        tournamentId: tournamentId,
        tournamentName: tournamentName,
        game: game,
    })
    .catch((error) => {
        console.error("Erreur :", error);
        alert("Erreur lors de l'ajout du tournoi !");
    });
}

teams.forEach((item) => {
    preTeams1.innerHTML += '<option value="' + item.name + '"> ' + item.name + ' </option>';
});
preTeams1.addEventListener("change", function() {
    const value = this.value;
    const img = document.getElementById("imgTeam1");
    if(value==="autre") {
        img.setAttribute("src", 'images/teams/noLogo.png');
        formTeam1Name.setAttribute("style", "");
    } else {
        const team = teams.find(t => t.name === value);
        img.setAttribute("src", team.imagePath);
        formTeam1Name.setAttribute("style", "display: none;");
    }
});

teams.forEach((item) => {
    preTeams2.innerHTML += '<option value="' + item.name + '"> ' + item.name + ' </option>';
});
preTeams2.addEventListener("change", function() {
    const value = this.value;
    const img = document.getElementById("imgTeam2");
    if(value==="autre") {
        img.setAttribute("src", 'images/teams/noLogo.png');
        formTeam2Name.setAttribute("style", "");
    } else {
        const team = teams.find(t => t.name === value);
        img.setAttribute("src", team.imagePath);
        formTeam2Name.setAttribute("style", "display: none;");
    }
});

function modifSelectTournament(game) {
    db.collection("tournaments")
        .where("game", "==", game)
        .orderBy("tournamentName")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                selectTournament.innerHTML += '<option value="' + doc.data().tournamentId + '">' + doc.data().tournamentName + '</option>';
            });
        });
}

selectTournament.addEventListener("change", function() {
    const value = this.value;
    const input = document.getElementById("inputTournament");
    if(value=="autre") {
        input.setAttribute("style", "");
    } else {
        input.setAttribute("style", "display: none;");
    }
});

selectGame.addEventListener("change", function() {
    const value = this.value;
    selectTournament.innerHTML = '<option value="autre"> Autre (à renseigner manuellement) </option>';
    modifSelectTournament(value);
});

modifSelectTournament("valorant");
>>>>>>> 329f3506195e750c337ff8a266ea732b7c44a560
