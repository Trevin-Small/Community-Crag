import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDcpBJydcQt4vM-SAdnbRMI-GP0kPU_tn8",
    authDomain: "community-crag.firebaseapp.com",
    databaseURL: "https://community-crag-default-rtdb.firebaseio.com",
    projectId: "community-crag",
    storageBucket: "community-crag.appspot.com",
    messagingSenderId: "683436041104",
    appId: "1:683436041104:web:a8486a1b267488a5d2c915",
    measurementId: "G-LJPR80L555"
  };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export var postRef = collection(db, 'community-posts');
