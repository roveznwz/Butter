import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByCm_3HWTegvUD_EjBShHZOh_e2hgx4hM",
  authDomain: "butter-clicker.firebaseapp.com",
  projectId: "butter-clicker",
  storageBucket: "butter-clicker.firebasestorage.app",
  messagingSenderId: "555459798916",
  appId: "1:555459798916:web:124abae374eb57192bdfd1",
  measurementId: "G-RR7WN0FMQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    console.log('🔐 Starting Google Sign In popup...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('✅ Google Sign In successful:', result.user.email);
    return result;
  } catch (error: any) {
    console.error('❌ Google Sign In error:', error.code, error.message);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Connexion annulée par l\'utilisateur');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Erreur réseau - vérifiez votre connexion');
    }
    throw error;
  }
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

// Sauvegarder la progression du jeu
export const saveGameProgress = async (userId: string, gameState: any) => {
  try {
    await setDoc(doc(db, "users", userId, "gameProgress", "latest"), gameState);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
  }
};

// Charger la progression du jeu
export const loadGameProgress = async (userId: string) => {
  try {
    const docSnap = await getDoc(doc(db, "users", userId, "gameProgress", "latest"));
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
  }
  return null;
};
