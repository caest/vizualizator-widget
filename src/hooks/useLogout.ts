import { getAuth, signOut } from 'firebase/auth';
import { app } from '../api/firebase';

export const useLogout = () => {
  const auth = getAuth(app);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Помилка виходу:", (error as Error).message);
    }
  };

  return { logout };
};