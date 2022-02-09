import {
    homeRedirect,
    db,
    postCollectionName,
    isSignedIn,
    CragDB,
    CacheDB
} from '../library/library.js';


export async function viewPost(postObject = null) {
    let post = postObject;

    if (post == null) {
        post = await getPostByURL();
    }

    if (post != null) {
        post.renderViewPost();
        await showButtons(post);
    } else {
        window.location.href = "https://communitycrag.com/postnotfound";
    }
}

async function showButtons(post) {

    const flex = 'flex';
    const none = 'none';
    const adminUID = "HdsKN00bCnTn9dmFkYtLLiMnOA42";
    const signedIn = await isSignedIn();

    if (post.getSetterUID() === CacheDB.getUID() || CacheDB.getUID() == adminUID) {
        document.getElementById('delete-post-button').style.display = flex;
    }

    // Hide the suggest grade button for the post creator
    if (post.getSetterUID() === CacheDB.getUID()) {
        return;
    }

    // Display the suggest grade button, and show up/down if previously voted.
    if (signedIn) {
        const suggestGradeButton = document.getElementById('suggest-grade-button');
        suggestGradeButton.style.display = flex;

        const suggestion = post.getUserSuggestion(CacheDB.getUID());

        if (suggestion == 0) {
            document.getElementById('not-suggested-icon').style.display = flex;
            document.getElementById('up-grade-icon').style.display = none;
            document.getElementById('down-grade-icon').style.display = none;
        } else if (suggestion == 1) {
            document.getElementById('not-suggested-icon').style.display = none;
            document.getElementById('up-grade-icon').style.display = flex;
            document.getElementById('down-grade-icon').style.display = none;
            suggestGradeButton.setAttribute('onclick', "");
        } else {
            document.getElementById('not-suggested-icon').style.display = none;
            document.getElementById('up-grade-icon').style.display = none;
            document.getElementById('down-grade-icon').style.display = flex;
            suggestGradeButton.setAttribute('onclick', "");
        }
    }
}

export async function suggestGrade() {
    document.getElementById('suggest-grade-submit').disabled = true;
    document.getElementById('suggest-grade-button').setAttribute('onclick', '');
    const isSuggestingHarder = document.getElementById('suggestion-choice').checked;
    const postId = getIdByURL();

    try {
        let post = await CragDB.getPost(db, postCollectionName, postId);

        hideGradePopup();

        if (post != null) {

            const userSuggestionState = post.getUserSuggestion(CacheDB.getUID());

            // If user has never previously voted
            if (userSuggestionState == 0) {
                const suggestionNum = isSuggestingHarder == true ? 1 : -1;
                post.suggestGrade(suggestionNum, CacheDB.getUID());
                CacheDB.cachePost(post);
                await CragDB.updatePostGrade(db, postCollectionName, postId, post);
                viewPost(post);
            }

        } else {
            window.location.href = "https://communitycrag.com/postnotfound";
        }
    } catch (e) {
        console.log("Error suggesting grade: " + e);
        document.getElementById('suggest-grade-submit').disabled = false;
        document.getElementById('suggest-grade-button').setAttribute('onclick', 'communityCrag.showSuggestGrade();');
    }
}

export async function deletePostByURL() {
    hideDeletePopup();
    const postId = getIdByURL();
    await CragDB.deletePost(db, postCollectionName, postId);
    homeRedirect();
}

export function showGradePopup() {
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('shadow').style.visibility = 'visible';
    document.getElementById('suggest-grade-popup').style.display = 'flex';
    document.getElementById('suggest-grade-popup').style.visibility = 'visible';
}

export function hideGradePopup() {
    document.getElementById('shadow').style.display = 'none';
    document.getElementById('shadow').style.visibility = 'hidden';
    document.getElementById('suggest-grade-popup').style.display = 'none';
    document.getElementById('suggest-grade-popup').style.visibility = 'hidden';
}

export function showDeletePopup() {
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('shadow').style.visibility = 'visible';
    document.getElementById('delete-post').style.display = 'flex';
    document.getElementById('delete-post').style.visibility = 'visible';
}

export function hideDeletePopup() {
    document.getElementById('shadow').style.display = 'none';
    document.getElementById('shadow').style.visibility = 'hidden';
    document.getElementById('delete-post').style.display = 'none';
    document.getElementById('delete-post').style.visibility = 'hidden';
}

function getIdByURL() {
    let url = window.location.href.replace("https://communitycrag.com/viewpost?id=", "").replace(/%20/g, " ");
    url = url.split("&")[0];
    return url;
}

async function getPostByURL() {
    const postId = getIdByURL();
    const cachedPost = CacheDB.getCachedPost(postId);
    let post = null;

    if (cachedPost != null) { // If the post is already cached
        console.log("Displaying cached post...");
        post = cachedPost;
    } else { // If a user visits a link directly without visiting the home page, the post wont be cached -> Fetch it instead.
        console.log("Displaying db fetched post...");
        post = await CragDB.getPost(db, postCollectionName, postId);
    }

    return post;
}