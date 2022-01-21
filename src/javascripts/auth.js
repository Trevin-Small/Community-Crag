import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from './index';

const auth = getAuth();
const userRef = collection(db, 'users');

export async function createAccount(email, username, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    // ..
    });

    try {
        await setDoc(doc(db, 'users', email), {name: username}, { merge: false });
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

export async function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });

    const userDoc = await getDoc(doc(db, 'users', email));
    if (userDoc.exists()) {
      const username = userDoc.data().name;
    }
}

/* Keeping user signed in across site...
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});*/