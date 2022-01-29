import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, postCollectionName, storage } from './index';
import { isSignedIn, getUID } from './auth.js';
import { homeRedirect } from './sharedFunctions';
import { Post } from './post';

export async function viewPost() {
    const postId = window.location.href.split("?")[1].replace(/%20/g, " ");
    const docRef = doc(db, postCollectionName, postId);
    const postDoc = await getDoc(docRef);
    if (postDoc.exists()) {
        const postData = postDoc.data();
        let post = new Post(postData.postTime, postData.uid, postData.setterName, postData.name, postData.image, postData.comment, postData.climbType, postData.grade, postData.gradeCount, postData.starRating);
        post.viewPost();
        showButtons(post);
    } else {
        window.location.href = "https://communitycrag.com/postnotfound";
    }
}

function showButtons(post) {
    const displayType = 'flex';
    if (isSignedIn()) {
        document.getElementById('suggest-grade-button').style.display = displayType;
    }
    if (post.getUID() === getUID()) {
        document.getElementById('delete-post-button').style.display = displayType;
    }
}

export function showSuggestGrade() {
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('shadow').style.visibility = 'visible';
    document.getElementById('suggest-grade').style.display = 'flex';
    document.getElementById('suggest-grade').style.visibility = 'visible';
}

export function hideSuggestGrade() {
    document.getElementById('shadow').style.display = 'none';
    document.getElementById('shadow').style.visibility = 'hidden';
    document.getElementById('suggest-grade').style.display = 'none';
    document.getElementById('suggest-grade').style.visibility = 'hidden';
}

export async function suggestGrade() {
    const suggestedGrade = parseInt(document.getElementById('grade').value) + 0.5;
    console.log(suggestedGrade);
    if (suggestedGrade < 0) {
        hideSuggestGrade();
        return;
    }
    const postId = window.location.href.split("?")[1].replace(/%20/g, " ");
    console.log("Post ID: ", postId);
    const docRef = doc(db, postCollectionName, postId);

    const postDoc = await getDoc(docRef);
    if (postDoc.exists()) {
        const postData = postDoc.data();
        let post = new Post(postData.postTime, postData.uid, postData.setterName, postData.name, postData.image, postData.comment, postData.climbType, postData.grade, postData.gradeCount, postData.starRating);
        post.suggestGrade(suggestedGrade);

        await setDoc(docRef, {
            postTime: post.getNumericPostTime(),
            uid: post.getUID(),
            setterName: post.getSetterName(),
            name: post.getName(),
            image: post.getImage(),
            grade: post.getNumericalGrade(),
            gradeCount: post.getGradeCount(),
            comment: post.getComment(),
            climbType: post.getClimbType(),
            starRating: post.getStarRating(),
        });

        post.viewPost();

    } else {
        window.location.href = "https://communitycrag.com/postnotfound";
    }

    hideSuggestGrade();
}

export function showDelete() {
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('shadow').style.visibility = 'visible';
    document.getElementById('delete-post').style.display = 'flex';
    document.getElementById('delete-post').style.visibility = 'visible';
}

export function hideDelete() {
    document.getElementById('shadow').style.display = 'none';
    document.getElementById('shadow').style.visibility = 'hidden';
    document.getElementById('delete-post').style.display = 'none';
    document.getElementById('delete-post').style.visibility = 'hidden';
}

export async function deletePost() {

    hideDelete();
    const postId = window.location.href.split("?")[1].replace(/%20/g, " ");
    const docRef = doc(db, postCollectionName, postId);
    const postDoc = await getDoc(docRef);
    const postData = postDoc.data();
    const imageRef = ref(storage, postData.image);
    await deleteObject(imageRef);
    await deleteDoc(docRef);
    homeRedirect();
}