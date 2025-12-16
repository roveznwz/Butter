# 🧈 BUTTER EMPIRE - Configuration Firebase

## Setup Google Authentication et Cloud Firestore

### Étape 1: Créer un projet Firebase
1. Allez sur [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Cliquez sur "Créer un projet"
3. Nommez-le "butter-empire"
4. Acceptez les conditions et créez le projet

### Étape 2: Activer Google Auth
1. Dans la console Firebase, allez à **Authentication** > **Sign-in method**
2. Activez **Google** comme fournisseur d'authentification
3. Remplissez les informations demandées et enregistrez

### Étape 3: Créer une app web
1. Dans les paramètres du projet, cliquez sur "Ajouter une app"
2. Choisissez **Web** (</>)
3. Donnez-lui un nom et enregistrez
4. Copiez la configuration Firebase (vous en aurez besoin)

### Étape 4: Activer Firestore
1. Dans la console Firebase, allez à **Firestore Database**
2. Cliquez sur "Créer une base de données"
3. Choisissez le mode de démarrage: **Mode test** (pour développement)
4. Choisissez votre région préférée

### Étape 5: Mettre à jour la configuration
1. Ouvrez le fichier `src/firebase.ts`
2. Remplacez `firebaseConfig` avec vos valeurs réelles:

```typescript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

Vous trouverez ces valeurs dans les paramètres de votre app web Firebase.

### Étape 6: Configurer les règles Firestore (sécurité)
1. Dans Firestore, allez à l'onglet **Règles**
2. Remplacez le contenu par:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/gameProgress/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Publiez les règles

### 🎮 C'est prêt!
- Les joueurs peuvent maintenant se connecter avec Google
- Leur progression sera sauvegardée automatiquement toutes les 10 secondes
- Ils verront un message "✅ Progression sauvegardée automatiquement"
- La progression se chargera automatiquement à chaque visite
