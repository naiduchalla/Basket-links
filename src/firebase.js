
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { getFirestore } from 'firebase/firestore';


import { getDatabase } from 'firebase/database';
const firebaseConfig = {
    // your config here
    apiKey: "AIzaSyCzG73vv0b1fQvy9jqArANBNmQIX9JEt84",
    authDomain: "basket-links.firebaseapp.com",
    projectId: "basket-links",
    storageBucket: "basket-links.appspot.com",
    messagingSenderId: "784775846379",
    appId: "1:784775846379:web:cfb2b43c03010504b561ae",
    measurementId: "G-4SNZTVB6E1"
  };
  
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
  const auth = getAuth();
  
  const db = getDatabase(app);
  
  
  
  const storage = getStorage(app);  
  export { auth, db ,storage };