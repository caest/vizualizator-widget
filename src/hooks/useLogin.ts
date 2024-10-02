import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../api/firebase';
import { notification } from 'antd';
import { FirebaseError } from 'firebase/app';

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const auth = getAuth(app);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      let errorMessage = 'Сталася помилка входу';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Неправильний логін або пароль';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Користувача не знайдено';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Неправильний пароль';
            break;
          default:
            errorMessage = 'Невідома помилка';
        }
      }
      notification.error({
        message: 'Помилка входу',
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};