function checkAdminAccount() {
    if (window.firebaseUser) {
        db.collection("users")
            .where("uid", "==", window.firebaseUser.uid)
            .where("email", "==", "corentin.choc@gmail.com")
            .get()
            .then((snapshot) => {
                if(!snapshot.empty) {
                    document.getElementById("matchSigning").setAttribute("style", "");
                    document.getElementById("resultWriting").setAttribute("style", "");
                }
            })
            .catch((error) => {
                console.error("Admin log Error : " + error);
                alert("Erreur lors de la récupération des comptes Admins !");
            });
    } else {
        document.getElementById("matchSigning").setAttribute("style", "display: none;");
        document.getElementById("resultWriting").setAttribute("style", "display: none;");
    }
}

// Vérifier au chargement
checkAdminAccount();

// Vérifier chaque fois que l'authentification change
firebase.auth().onAuthStateChanged(() => {
    checkAdminAccount();
});
