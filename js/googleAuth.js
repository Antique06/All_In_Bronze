const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const googleSignBtn = document.getElementById('googleSignBtn');
const buttonText = document.getElementById('buttonText');

if (googleSignBtn) {
    googleSignBtn.dataset.signedIn = 'false';

    googleSignBtn.addEventListener('click', () => {
        if (googleSignBtn.dataset.signedIn === 'true') {
            auth.signOut().catch(err => console.error('Erreur signOut:', err));
            return;
        }

        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                db.collection("users")
                    .where("email", "==", user.email)
                    .get()
                    .then((snapshot) => {
                        if(snapshot.empty) {
                            const email = user.email;
                            const displayName = user.displayName;
                            const uid = user.uid;

                            // premier login -> demander un username
                            let username = prompt("Bienvenue ! Choisissez un nom d'utilisateur pour les classements :");
                            if (!username || username.trim() === "") {
                                username = displayName || "Utilisateur";
                            }

                            db.collection("users")
                            .add({
                                uid: uid,
                                email: email,
                                displayName: displayName,
                                username: username,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Erreur :", error);
                        alert("Erreur lors de l'ajout du nouvel utilisateur !");
                    });
            })
            .catch((error) => {
                console.error('Erreur sign-in:', error);
                alert("Erreur lors de la connection !");
            });
    });

    auth.onAuthStateChanged((user) => {
        window.firebaseUser = user;
        // mettre à jour le leaderboard si on est sur la page d'accueil
        const sel = document.getElementById('leaderboardTournament');
        if(sel && sel.value && typeof renderHomeLeaderboard === 'function') {
            renderHomeLeaderboard(sel.value);
        }
        if (user) {
            googleSignBtn.dataset.signedIn = 'true';
            buttonText.innerHTML = 'Se déconnecter';
        } else {
            googleSignBtn.dataset.signedIn = 'false';
            buttonText.innerHTML = 'Se connecter';
        }
    });
}