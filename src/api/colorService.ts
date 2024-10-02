import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Color, Language } from '../types/types'

export const subscribeToLanguages = (callback: (languages: Language[]) => void) => {
  return onSnapshot(collection(db, 'languages'), (snapshot) => {
    const languagesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Language[];
    callback(languagesData);
  });
};

export const subscribeToColors = (callback: (colors: Color[]) => void) => {
  return onSnapshot(collection(db, 'colors'), (snapshot) => {
    const colorsData = snapshot.docs.map((doc) => ({
      key: doc.id,
      ...doc.data(),
    })) as Color[];
    callback(colorsData);
  });
};

export const addColor = async (color: Omit<Color, 'key'>) => {
  await addDoc(collection(db, 'colors'), color);
};

export const deleteColor = async (colorId: string) => {
  await deleteDoc(doc(db, 'colors', colorId));
};