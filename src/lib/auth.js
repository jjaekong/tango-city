import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function isAdmin(uid) {
  if (!uid) return false;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data();
    return userData.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
} 