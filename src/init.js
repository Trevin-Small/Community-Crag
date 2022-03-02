import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// <-------------------------------------------------------------------------------------->

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

// Firebase initialization
const app = initializeApp(firebaseConfig);
// <-------------------------------------------------------------------------------------->

// Firestore collection names
export const postCollectionName = 'community-posts';
export const usersCollectionName = 'purdue-users';

// Clouse storage collection
export const imageStorageName = 'purdue';

// Firestore db & collections
export const db = getFirestore(app);
export const postCollection = collection(db, postCollectionName);
export const userCollection = collection(db, usersCollectionName);

// Cloud storage
export const storage = getStorage(app);

// Image transformation URLs
export const firebaseBaseURL = "https://firebasestorage.googleapis.com/v0/b/community-crag.appspot.com/o/purdue%2F";
export const imageKitBaseURL = "https://ik.imagekit.io/communitycrag/";
export const verticalThumbnailTransformation = "tr:n-thumbnail_vertical/";
export const horizontalThumbnailTransformation = "tr:n-thumbnail_horizontal/";