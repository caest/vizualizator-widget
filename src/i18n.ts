import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './api/firebase';

// Тип для перевода
interface Translations {
  [key: string]: string | Translations;
}

// Тип для документа с языком
interface LanguageData {
  id: string;
  name: string;
  translations: Translations;
}

// Получаем все языки и их переводы из Firebase
const fetchLanguages = async (): Promise<Record<string, { translation: Translations }>> => {
  const languagesCollection = collection(db, 'languages');
  const snapshot = await getDocs(languagesCollection);
  const languages: Record<string, { translation: Translations }> = {};

  snapshot.forEach((doc) => {
    const data = doc.data() as LanguageData;
    languages[data.id] = { translation: data.translations };
  });

  return languages;
};

// Получаем язык по умолчанию — это первый язык из коллекции Firebase
const fetchDefaultLanguage = async (): Promise<string> => {
  const languagesCollection = collection(db, 'languages');
  const snapshot = await getDocs(languagesCollection);

  // Проверяем, есть ли документы в коллекции
  if (!snapshot.empty) {
    return snapshot.docs[0].data().id; // Берем первый документ в коллекции
  }

  throw new Error('Коллекция языков пуста!');
};

const initI18next = async (): Promise<void> => {
  try {
    const resources = await fetchLanguages(); // Получаем все переводы
    const defaultLanguage = await fetchDefaultLanguage(); // Получаем язык по умолчанию из Firebase

    i18n
      .use(initReactI18next)
      .init({
        resources, // Переводы всех языков
        lng: defaultLanguage, // Устанавливаем первый язык из Firebase как язык приложения
        fallbackLng: defaultLanguage, // Язык по умолчанию из Firebase
        interpolation: {
          escapeValue: false,
        },
      });
  } catch (error) {
    console.error('Ошибка инициализации i18n:', (error as Error).message);
    // Вы можете добавить здесь логику для показа ошибки на экране
  }
};

export default initI18next;