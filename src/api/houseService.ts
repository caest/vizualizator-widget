// src/api/houseService.ts
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; // Импортируйте конфигурацию Firebase

export const subscribeToLanguages = (setLanguages: (languages: any) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'languages'), (snapshot) => {
    const languagesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLanguages(languagesData);
  });

  return unsubscribe;
};

export const subscribeToHouses = (setHouses: (houses: any) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'houses'), (snapshot) => {
    const housesData = snapshot.docs.map((doc) => ({
      key: doc.id,
      ...doc.data(),
    }));
    setHouses(housesData);
  });

  return unsubscribe;
};

export const addHouse = async (house: Omit<{ language: string; name: string }, 'key'>) => {
  await addDoc(collection(db, 'houses'), house);
};

export const deleteHouse = async (key: string) => {
  await deleteDoc(doc(db, 'houses', key));
};
