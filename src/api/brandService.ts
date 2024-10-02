// src/api/brandService.ts
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
//import { Brand, Color, Language } from '../types'; 

interface Brand {
    key: string;
    name: string;
    description: string;
    colors: string[];
    advantages: { title: string; description: string }[];
    language: string;
  }
  
  interface Color {
    key: string;
    name: string;
    code: string;
    language: string;
  }
  
  interface Language {
    id: string;
    name: string;
  }
  
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

export const subscribeToBrands = (callback: (brands: Brand[]) => void) => {
  return onSnapshot(collection(db, 'brands'), (snapshot) => {
    const brandsData = snapshot.docs.map((doc) => ({
      key: doc.id,
      ...doc.data(),
    })) as Brand[];
    callback(brandsData);
  });
};

export const addBrand = async (values: Omit<Brand, 'key'>) => {
  return await addDoc(collection(db, 'brands'), values);
};

export const deleteBrand = async (key: string) => {
  return await deleteDoc(doc(db, 'brands', key));
};
