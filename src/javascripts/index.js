import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage, ref } from "firebase/storage";

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

const app = initializeApp(firebaseConfig);
const storage = getStorage();
export const db = getFirestore(app);
export const postRef = collection(db, 'community-posts');
export const imageRef = ref(storage, 'purdue');
