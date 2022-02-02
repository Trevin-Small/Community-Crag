import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './index.js';
import { Errors } from './errors.js';
import { CacheDB } from './cache.js';

const auth = getAuth();

onAuthStateChanged(auth, (activeUser) => {
  if (activeUser) {

    // User is signed in
    if (isEmailVerified()) {
      updateNavBar(true);
    }

    CacheDB.markSignedIn();
    CacheDB.setUID(activeUser.uid);

  } else {

    // User is signed out
    updateNavBar(false);
    CacheDB.clearUID();

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

    await createUserWithEmailAndPassword(auth, email, password).catch(function(error) {
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

    updateProfile(getUsername(), {displayName: username});
    await pushUserToFirebase(CacheDB.getUID(), username);
    await sendEmailVerification(auth.currentUser);
    Errors.infoMessage(emailVerificationMessage, 'info-message');
    logOut();
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

  await signInWithEmailAndPassword(auth, email, password).catch(function(error) {
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
      Errors.errorMessage("Please verify your email before signing in.", errorId);
      logOut();
      return;
  }

  signedInRedirect();

}

export function logOut() {
  auth.signOut();
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
  exceptions.forEach(function(exception) {
    if (email === exception) {
      returnVal = true;
    }
  });
  return returnVal;
}

export async function getUsername() {
  try {
    const userSnap = await getDoc(doc(db, 'purdue-users', CacheDB.getUID()));
    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.username.toString();
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

function signedInRedirect() {
  const baseUrl = 'https://communitycrag.com';
  if (window.location.href === baseUrl + '/signup' || window.location.href === baseUrl + '/login') {
    window.location.href = baseUrl;
  }
}

function updateNavBar(isSignedIn) {
  let notSignedIn = "block";
  let signedIn = "none";
  let signedInFlex = 'none';
  if (isSignedIn) {
      notSignedIn = "none";
      signedIn = "block";
      signedInFlex = 'flex';
  }
  try {
      document.getElementById('nav-log-in').style.display = notSignedIn;
  } catch {}
  try {
      document.getElementById('nav-sign-up').style.display = notSignedIn;
  } catch {}
  try {
      document.getElementById('nav-log-out').style.display = signedIn;
  } catch {}
  try {
      document.getElementById('nav-new-post').style.display = signedIn;
  } catch {}
  try {
    document.getElementById('nav-new-post').style.display = signedIn;
  } catch {}
}