import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { errorMessage, resetBorders, inputErrorBorderHighlight } from './errors.js';
import { updateNavBar } from './explorePosts';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './index.js';

const auth = getAuth();
var uID = null;
var g_username = null;

onAuthStateChanged(auth, (activeUser) => {
  if (activeUser) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    updateNavBar(true);
    uID = activeUser.uid.toString();
    // ...
  } else {
    // User is signed out
    updateNavBar(false);
    // ...
  }
});

async function pushUserToFirebase(someUID, someUsername) {
  try {
    await setDoc(doc(db, 'purdue-users', someUID), {
      username: someUsername
    });
  } catch (e) {
    console.error("Error adding user document: ", e);
  }
}

export async function signUp() {

    resetBorders(['#777', '3px'], ['email', 'username', 'pass']);
    resetBorders(['black', '3px'], ['submit-signup']);

    const errorId = 'error-message';
    const errorMessages = [
        'Email domain must be "@purdue.edu"',
        'Username cannot be over 15 characters!',
        'Username cannot under 3 characters!',
        'Password must be at least 6 characters!',
        'Whitespace is not allowed in this field!',
        'Field(s) cannot be left empty!',
        'Invalid Email!',
        'An account with this email already exists!',
        'Password is too weak.'
    ]

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('pass').value;

    if (email.split('@')[1] !== 'purdue.edu') {
      inputErrorBorderHighlight('email');
      inputErrorBorderHighlight('submit-signup');
      errorMessage(errorMessages[0], errorId);
      return;
    } else if (email.includes(' ')) {
      inputErrorBorderHighlight('email');
      inputErrorBorderHighlight('submit-signup');
      errorMessage(errorMessages[4], errorId);
      return;
    } else if (username.length > 15) {
      inputErrorBorderHighlight('username');
      inputErrorBorderHighlight('submit-signup');
      errorMessage(errorMessages[1], errorId);
      return;
    } else if (username.length < 3) {
      inputErrorBorderHighlight('username');
      inputErrorBorderHighlight('submit-signup');
      errorMessage(errorMessages[2], errorId);
      return;
    } else if (/^\s*$/.test(username)) {
      inputErrorBorderHighlight('username');
      inputErrorBorderHighlight('submit-signup');
      errorMessage(errorMessages[5], errorId);
      return;
    } else if (password.length < 6) {
      inputErrorBorderHighlight('pass');
      inputErrorBorderHighlight('submit-signup');
      errorMessage(errorMessages[3], errorId);
      return;
    } else if (password.includes(' ')) {
      inputErrorBorderHighlight('pass');
      inputErrorBorderHighlight('submit-signup');
      errorMessage(errorMessages[4], errorId);
      return;
    }

    await createUserWithEmailAndPassword(auth, email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      if (errorCode == 'auth/email-already-in-use') {
        inputErrorBorderHighlight('email');
        inputErrorBorderHighlight('submit-signup');
        errorMessage(errorMessages[7], errorId);
        return;
      } else if (errorCode == 'auth/invalid-email') {
        inputErrorBorderHighlight('email');
        inputErrorBorderHighlight('submit-signup');
        errorMessage(errorMessages[6], errorId);
        return;
      } else if (errorCode == 'auth/weak-password') {
        inputErrorBorderHighlight('email');
        inputErrorBorderHighlight('submit-signup');
        errorMessage(errorMessages[8], errorId);
        return;
      }

    });

    updateProfile(getUsername(), {displayName: username});
    await pushUserToFirebase(uID, username);
    g_username = username;
    signedInRedirect();
}

export async function signIn() {

  resetBorders(['#777', '3px'], ['email', 'pass']);
  resetBorders(['black', '3px'], ['submit-login']);

  const errorId = 'error-message';
  const errorMessages = [
      'Email domain must be "@purdue.edu"',
      'Field(s) cannot be left empty!',
      'Invalid Email.',
      'This account has been disabled.',
      'No account exists with this email.',
      'Incorrect Password.'
  ];

  const email = document.getElementById('email').value;
  const password = document.getElementById('pass').value;

  if (email.split('@')[1] !== 'purdue.edu') {
    inputErrorBorderHighlight('email');
    inputErrorBorderHighlight('submit-login');
    errorMessage(errorMessages[0], errorId);
    return;
  } else if (/^\s*$/.test(email)) {
    inputErrorBorderHighlight('email');
    inputErrorBorderHighlight('submit-login');
    errorMessage(errorMessages[1], errorId);
    return;
  } else if (/^\s*$/.test(password)) {
    inputErrorBorderHighlight('pass');
    inputErrorBorderHighlight('submit-login');
    errorMessage(errorMessages[1], errorId);
    return;
  }

  await signInWithEmailAndPassword(auth, email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    if (errorCode === 'auth/invalid-email') {
      inputErrorBorderHighlight('email');
      inputErrorBorderHighlight('submit-login');
      errorMessage(errorMessages[2], errorId);
      return;
    } else if (errorCode === 'auth/user-disabled') {
      inputErrorBorderHighlight('email');
      inputErrorBorderHighlight('pass');
      inputErrorBorderHighlight('submit-login');
      errorMessage(errorMessages[3], errorId);
      return;
    } else if (errorCode === 'auth/user-not-found') {
      inputErrorBorderHighlight('email');
      inputErrorBorderHighlight('submit-login');
      errorMessage(errorMessages[4], errorId);
      return;
    } else if (errorCode === 'auth/wrong-password') {
      inputErrorBorderHighlight('pass');
      inputErrorBorderHighlight('submit-login');
      errorMessage(errorMessages[5], errorId);
      return;
    }
  });

  signedInRedirect();

}

export function logOut() {
  auth.signOut();
}

export async function getUsername() {
  if (g_username != null) {
    return g_username;
  } else {
    const userSnap = await getDoc(doc(db, 'purdue-users', uID));
    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.username.toString();
    } else {
      return null;
    }
  }
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
  const baseUrl = 'https://communitycrag.com';
  if (window.location.href === baseUrl + '/signup' || window.location.href === baseUrl + '/login') {
    window.location.href = baseUrl;
  }
}

function printUsername() {
  console.log('Username: ' + username);
}