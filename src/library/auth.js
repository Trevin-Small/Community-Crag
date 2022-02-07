import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, usersCollectionName } from '../init.js';
import { Errors } from './errors.js';
import { CacheDB } from './cache.js';

const auth = getAuth();

onAuthStateChanged(auth, (activeUser) => {
  if (activeUser) {

    // User is signed in
    if (isEmailVerified()) {
      //updateNavBar(true);
      CacheDB.signIn(activeUser.uid);
    }

  } else {

    // User is signed out
    //updateNavBar(false);
    CacheDB.signOut();

  }
});

async function pushUserToFirebase(someUID, someUsername) {
  try {
    await setDoc(doc(db, usersCollectionName, someUID), {
      username: someUsername
    });
  } catch (e) {
    console.error("Error adding user document: ", e);
  }
}

export async function signUp() {

  Errors.resetBorders(['#777', '3px'], ['email', 'username', 'pass', 're-pass']);

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
    'Password is too weak.',
    'Passwords must match!'
  ]
  const emailVerificationMessage = "An email verification is on its way! Check your inbox for a message from us."

  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('pass').value;
  const retypePassword = document.getElementById('re-pass').value;

  const isException = isExceptionEmail(email);
  if (!isException) {
    if (email.split('@')[1] !== 'purdue.edu') {
      Errors.inputErrorBorderHighlight('email');
      Errors.errorMessage(errorMessages[0], errorId);
      return;
    } else if (email.includes(' ')) {
      Errors.inputErrorBorderHighlight('email');
      Errors.errorMessage(errorMessages[4], errorId);
      return;
    }
  }

  if (username.length > 15) {
    Errors.inputErrorBorderHighlight('username');
    Errors.errorMessage(errorMessages[1], errorId);
    return;
  } else if (username.length < 3) {
    Errors.inputErrorBorderHighlight('username');
    Errors.errorMessage(errorMessages[2], errorId);
    return;
  } else if (/^\s*$/.test(username)) {
    Errors.inputErrorBorderHighlight('username');
    Errors.errorMessage(errorMessages[5], errorId);
    return;
  } else if (password.length < 6) {
    Errors.inputErrorBorderHighlight('pass');
    Errors.errorMessage(errorMessages[3], errorId);
    return;
  } else if (password.includes(' ')) {
    Errors.inputErrorBorderHighlight('pass');
    Errors.errorMessage(errorMessages[4], errorId);
    return;
  } else if (retypePassword !== password) {
    Errors.inputErrorBorderHighlight('pass');
    Errors.inputErrorBorderHighlight('re-pass');
    Errors.errorMessage(errorMessages[9], errorId);
    return;
  }

  await createUserWithEmailAndPassword(auth, email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    if (errorCode == 'auth/email-already-in-use') {
      Errors.inputErrorBorderHighlight('email');
      Errors.errorMessage(errorMessages[7], errorId);
      return;
    } else if (errorCode == 'auth/invalid-email') {
      Errors.inputErrorBorderHighlight('email');
      Errors.errorMessage(errorMessages[6], errorId);
      return;
    } else if (errorCode == 'auth/weak-password') {
      Errors.inputErrorBorderHighlight('email');
      Errors.errorMessage(errorMessages[8], errorId);
      return;
    }

  });

  updateProfile(getUsername(), { displayName: username });
  await pushUserToFirebase(getUID(), username);
  await sendEmailVerification(auth.currentUser);
  Errors.infoMessage(emailVerificationMessage, 'info-message');
  logOut(false);
  //signedInRedirect();

}

export async function signIn() {

  Errors.resetBorders(['#777', '3px'], ['email', 'pass']);
  Errors.resetBorders(['black', '3px'], ['submit-login']);

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

  if (!isExceptionEmail(email)) {
    if (/^\s*$/.test(email)) {
      Errors.inputErrorBorderHighlight('email');
      Errors.inputErrorBorderHighlight('submit-login');
      Errors.errorMessage(errorMessages[1], errorId);
      return;
    } else if (email.split('@')[1] !== 'purdue.edu') {
      Errors.inputErrorBorderHighlight('email');
      Errors.inputErrorBorderHighlight('submit-login');
      Errors.errorMessage(errorMessages[0], errorId);
      return;
    }
  }

  if (/^\s*$/.test(password)) {
    Errors.inputErrorBorderHighlight('pass');
    Errors.inputErrorBorderHighlight('submit-login');
    Errors.errorMessage(errorMessages[1], errorId);
    return;
  }

  await signInWithEmailAndPassword(auth, email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    if (errorCode === 'auth/invalid-email') {
      Errors.inputErrorBorderHighlight('email');
      Errors.inputErrorBorderHighlight('submit-login');
      Errors.errorMessage(errorMessages[2], errorId);
      return;
    } else if (errorCode === 'auth/user-disabled') {
      Errors.inputErrorBorderHighlight('email');
      Errors.inputErrorBorderHighlight('pass');
      Errors.inputErrorBorderHighlight('submit-login');
      Errors.errorMessage(errorMessages[3], errorId);
      return;
    } else if (errorCode === 'auth/user-not-found') {
      Errors.inputErrorBorderHighlight('email');
      Errors.inputErrorBorderHighlight('submit-login');
      Errors.errorMessage(errorMessages[4], errorId);
      return;
    } else if (errorCode === 'auth/wrong-password') {
      Errors.inputErrorBorderHighlight('pass');
      Errors.inputErrorBorderHighlight('submit-login');
      Errors.errorMessage(errorMessages[5], errorId);
      return;
    }
  });

  console.log("Verified: " + await isEmailVerified());
  const valid = await isValidUser();
  if (valid == 0) {
    Errors.errorMessage("You received an email from us. Please complete the verification before signing in.", errorId);
    logOut();
    return;
  }

  signedInRedirect();

}

function isExceptionEmail(email) {
  email = email.toLowerCase();
  const exceptions = [
    "mattoxicwaste@gmail.com",
    "abbyrobinson429@gmail.com",
    "carsonsmall2000@gmail.com",
    "jason.small@outlook.com",
    "jaysmallvegas@gmail.com",
    "shalyn.small@gmail.com",
    "trevincub03@gmail.com"
  ]
  let returnVal = false;
  exceptions.forEach(function (exception) {
    if (email === exception) {
      returnVal = true;
    }
  });
  return returnVal;
}

export async function sendPasswordReset() {

  document.getElementById('submit-reset').disabled = true;

  const email = document.getElementById('email').value;
  const infoId = "info-message";
  const errorId = "error-message";

  let actionCodeSettings = {
    url: 'https://communitycrag.com/login'
  };

  await sendPasswordResetEmail(auth, email, actionCodeSettings).then(function () {
    Errors.infoMessage("A password reset email is on its way! It may take a few minutes to deliver.", infoId);
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    if (errorCode === 'auth/invalid-email') {
      Errors.inputErrorBorderHighlight('email');
      Errors.inputErrorBorderHighlight('submit-reset');
      Errors.errorMessage("Invalid email.", errorId);
      return;
    } else if (errorCode === "auth/user-not-found") {
      Errors.inputErrorBorderHighlight('email');
      Errors.inputErrorBorderHighlight('submit-reset');
      Errors.errorMessage("An account does not exist for the given email.", errorId);
    } else {
      console.log(error);
      console.log("Error code: " + errorCode);
      Errors.inputErrorBorderHighlight('submit-reset');
      Errors.errorMessage("Oops! An internal error was encountered.", errorId);
    }
    document.getElementById('submit-reset').disabled = false;
  });
}

function getUID() {
  let uid = CacheDB.getUID();
  if (uid != null) {
    return uid;
  }
  uid = auth.currentUser.uid;
  CacheDB.setUID(uid);
  return uid;
}

export async function getUsername() {
  try {
    const userSnap = await getDoc(doc(db, usersCollectionName, getUID()));
    if (userSnap.exists()) {
      const data = userSnap.data();
      const username = data.username.toString();
      console.log("Username from firebase: " + username);
      return username;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

export async function isSignedIn() {
  return CacheDB.getIsSignedIn();
}

export function logOut(redirect = true) {
  auth.signOut();
  CacheDB.signOut();
  if (redirect) {
    signedOutRedirect();
  }
}

export async function isEmailVerified() {
  await auth.currentUser.reload();
  try {
    return auth.currentUser.emailVerified == true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function isValidUser() {
  if ((await isEmailVerified()) == false) {
    return 0;
  }
  if (getUsername() == null || auth.currentUser.uid == null) {
    return -1;
  }
  return 1;
}

export async function isAdmin() {
  let isAdminUser = false;
  console.log("UID: " + getUID());
  try {
    isAdminUser = await getDoc(doc(db, usersCollectionName, getUID()));
    isAdminUser = isAdminUser.data().isAdmin;
    console.log(isAdminUser);
  } catch { }
  return isAdminUser;
}

export function updateNavBar() {
  const isSignedIn = CacheDB.getIsSignedIn();
  let whenNotSignedIn = "block";
  let whenSignedIn = "none";

  if (isSignedIn) {
    whenNotSignedIn = "none";
    whenSignedIn = "block";
  }

  try {
    document.getElementById('navbar-login').style.display = whenNotSignedIn;
    document.getElementById('navbar-sign-up').style.display = whenNotSignedIn;

    document.getElementById('navbar-log-out').style.display = whenSignedIn;
    document.getElementById('navbar-new-post').style.display = whenSignedIn;
  } catch (e) {
    console.log("Update Nav Bar: " + e);
  }
}

function signedInRedirect() {
  const baseUrl = 'https://communitycrag.com';
  if (window.location.href === baseUrl + '/signup' || window.location.href === baseUrl + '/login') {
    window.location.href = baseUrl;
  }
}

function signedOutRedirect() {
  const signedOutURL = 'https://communitycrag.com/loggedout';
  window.location.href = signedOutURL;
}
