import { useEffect, useState } from 'react';
import { auth, signInWithGoogle, signOut } from './firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: any;
    
    try {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log('Auth state changed:', currentUser?.email || 'No user');
        setUser(currentUser);
        setLoading(false);
      }, (error) => {
        console.error('Auth error:', error);
        setError(error.message);
        setLoading(false);
      });
    } catch (err: any) {
      console.error('Setup error:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      console.log('Attempting Google sign in...');
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Erreur lors de la connexion Google:", error);
      setError(error.message);
    }
  };

  const logOut = async () => {
    try {
      console.log('Attempting sign out...');
      await signOut();
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      setError(error.message);
    }
  };

  return { user, loading, error, signIn, logOut };
};
