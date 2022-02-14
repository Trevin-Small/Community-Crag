import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");

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

// Captcha app check initialization
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LcqPHUeAAAAAIP9pwXSDBEohong3XTysrx_QqOn'),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true
});

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
export const storage = getStorage();


// Image transformation URLs
export const firebaseBaseURL = "https://firebasestorage.googleapis.com/v0/b/community-crag.appspot.com/o/purdue%2F";
export const imageKitBaseURL = "https://ik.imagekit.io/communitycrag/";
export const verticalImageTransformation = "tr:n-post_photo_vertical/";
export const horizontalImageTransformation = "tr:n-post_photo_horizontal/";
export const verticalThumbnailTransformation = "tr:n-thumbnail_vertical/";
export const horizontalThumbnailTransformation = "tr:n-thumbnail_horizontal/";