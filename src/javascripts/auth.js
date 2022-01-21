import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { updateNavBar } from "./explorePosts";

const auth = getAuth();

onAuthStateChanged(auth, (activeUser) => {
  if (activeUser) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log(getUsername());
    updateNavBar(true);
    // ...
  } else {
    // User is signed out
    updateNavBar(false);
    // ...
  }
});

export async function signUp(email, username, password) {
    console.log(username);
    await createUserWithEmailAndPassword(auth, email, password);
    updateProfile(getUsername(), {displayName: username});
    signedInRedirect();
}

export async function signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
    signedInRedirect();
}

export function logOut() {
  auth.signOut();
}

export function getUsername() {
  return auth.currentUser.displayName;
}

export function isSignedIn() {
  try {
    let username = getUsername();
  } catch {
    return false;
  }
  return true;
}

function signedInRedirect() {
  const baseUrl = "https://communitycrag.com";
  if (window.location.href === baseUrl + "/signup" || window.location.href === baseUrl + "/login") {
    window.location.href = baseUrl;
  }
}