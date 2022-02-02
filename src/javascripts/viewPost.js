import { doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, postCollectionName, storage } from './index';
import { isSignedIn } from './auth.js';
import { homeRedirect } from './sharedFunctions';
import { getPost, setPost } from './post';
import { CacheDB } from './cache';

export async function viewPost(postObject = null) {
    let post = postObject;

    if (post == null) {
        const postId = window.location.href.split("?")[1].replace(/%20/g, " ");

        const cachedPost = CacheDB.getCachedPost(postId);

        if (cachedPost != null) { // If the post is already cached
            console.log("Displaying cached post...");
            post = cachedPost;
        } else { // If a user visits a link directly without visiting the home page, the post wont be cached -> Fetch it instead.
            console.log("Displaying db fetched post...");
            post = await getPost(doc(db, postCollectionName, postId));
        }

    }

    if (post != null) {
        post.viewPost();
        showButtons(post);
    } else {
        window.location.href = "https://communitycrag.com/postnotfound";
    }
}

async function showButtons(post) {
    const flex = 'flex';
    const none = 'none';
    const signedIn = await isSignedIn();

    if (signedIn) {
        document.getElementById('suggest-grade-button').style.display = flex;

        const suggestion = post.getUserSuggestion(CacheDB.getUID());

        if (suggestion == 0) {
            document.getElementById('not-suggested-icon').style.display = flex;
            document.getElementById('up-grade-icon').style.display = none;
            document.getElementById('down-grade-icon').style.display = none;
        } else if (suggestion == 1) {
            document.getElementById('not-suggested-icon').style.display = none;
            document.getElementById('up-grade-icon').style.display = flex;
            document.getElementById('down-grade-icon').style.display = none;
        } else {
            document.getElementById('not-suggested-icon').style.display = none;
            document.getElementById('up-grade-icon').style.display = none;
            document.getElementById('down-grade-icon').style.display = flex;
        }
    }

    if (post.getSetterUID() === CacheDB.getUID()) {
        document.getElementById('delete-post-button').style.display = flex;
    }
}

export function showSuggestGrade() {
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('shadow').style.visibility = 'visible';
    document.getElementById('suggest-grade-popup').style.display = 'flex';
    document.getElementById('suggest-grade-popup').style.visibility = 'visible';
}

export function hideSuggestGrade() {
    document.getElementById('shadow').style.display = 'none';
    document.getElementById('shadow').style.visibility = 'hidden';
    document.getElementById('suggest-grade-popup').style.display = 'none';
    document.getElementById('suggest-grade-popup').style.visibility = 'hidden';
}

export async function suggestGrade() {
    document.getElementById('suggest-grade-submit').disabled = true;
    document.getElementById('suggest-grade-button').setAttribute('onclick','');
    const isSuggestingHarder = document.getElementById('suggestion-choice').checked;
    const postId = window.location.href.split("?")[1].replace(/%20/g, " ");
    const postReference = doc(db, postCollectionName, postId);

    try {
        let post = await getPost(postReference);

        hideSuggestGrade();

        if (post != null) {

            const userSuggestionState = post.getUserSuggestion(CacheDB.getUID());

            // If user has never previously voted
            if (userSuggestionState == 0) {
                const suggestionNum = isSuggestingHarder == true ? 1 : -1;
                post.suggestGrade(suggestionNum, CacheDB.getUID());
                CacheDB.cachePost(post);
                await setPost(postReference, post);
                viewPost(post);
            }

        } else {
            window.location.href = "https://communitycrag.com/postnotfound";
        }
    } catch {
        document.getElementById('suggest-grade-submit').disabled = false;
        document.getElementById('suggest-grade-button').setAttribute('onclick','communityCrag.showSuggestGrade();');
    }
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
    const postReference = doc(db, postCollectionName, postId);
    const post = await getPost(postReference);
    const imageRef = ref(storage, post.getImage());
    CacheDB.removePost(postId);
    await deleteObject(imageRef);
    await deleteDoc(postReference);
    homeRedirect();
}