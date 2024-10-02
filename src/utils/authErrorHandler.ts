import { FirebaseError } from 'firebase/app';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Неправильний логін або пароль';
      case 'auth/user-not-found':
        return 'Користувача не знайдено';
      case 'auth/wrong-password':
        return 'Неправильний пароль';
      default:
        return 'Невідома помилка';
    }
  }
  return 'Сталася помилка';
};