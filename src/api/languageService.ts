import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../api/firebase'; 

export const getLanguages = (callback: (languages: any[]) => void) => {
  return onSnapshot(collection(db, 'languages'), (snapshot) => {
    const languagesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(languagesData);
  });
};

export const addLanguage = async (name: string, code: string) => {
  await addDoc(collection(db, 'languages'), { name, code });
};

export const updateLanguage = async (id: string, name: string, code: string) => {
  const languageRef = doc(db, 'languages', id);
  await updateDoc(languageRef, { name, code });
};

export const deleteLanguage = async (id: string) => {
  const languageRef = doc(db, 'languages', id);
  await deleteDoc(languageRef);
};
