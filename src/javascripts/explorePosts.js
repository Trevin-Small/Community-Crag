import { query, where } from 'firebase/firestore';
import { postCollection } from './index.js';
import { getMultiplePosts } from './post.js';
import { CacheDB } from './cache.js';

function queryPosts(grade, starRating, climbType) {

    grade = parseInt(grade);
    grade = grade == -1 ? null : parseInt(grade);
    starRating = parseInt(starRating);
    starRating = starRating == 0 ? null : starRating;

    if (climbType == 1) {
        climbType = "Overhang";
    } else if (climbType == 2) {
        climbType = "Slab";
    } else if (climbType == 3) {
        climbType = "Mixed";
    } else if (climbType == 4) {
        climbType = "Vertical";
    } else if (climbType == 5) {
        climbType = "Other";
    } else {
        climbType = null;
    }

    // If searching for V10, include all climbs V10+
    let gradeSearchRange = 1;
    if (grade == 10) {
        gradeSearchRange = 10;
    }

    // All possible Query Combinations
    if (grade != null && starRating != null && climbType != null) {

        return query(postCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("starRating", "==", starRating), where("climbType", "==", climbType));

    } else if (grade != null && starRating != null) {

        return query(postCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("starRating", "==", starRating));

    } else if (grade != null && climbType != null) {

        return query(postCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("climbType", "==", climbType));

    } else if (starRating != null && climbType != null) {

        return query(postCollection, where("starRating", "==", starRating), where("climbType", "==", climbType));

    } else if (grade != null) {

        return query(postCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange));

    } else if (climbType != null) {

        return query(postCollection, where("climbType", "==", climbType));

    } else if (starRating != null) {

        return query(postCollection, where("starRating", "==", starRating));

    } else {

        return null;

    }
}

export async function displayPosts(queryRef) {

    let postListContainer = document.getElementById('post-list');
    while (postListContainer.lastChild != null && postListContainer.lastChild.nodeName !== 'DIV') {
        postListContainer.removeChild(postListContainer.lastChild);
    }

    let postArray = await getAllPosts(queryRef);

    postArray.forEach((post) => {
        post.renderPostList('placeholder-post', post.getPostId());
    });

    let spacer = document.createElement('span');
    spacer.style.marginBottom = '12vh';
    let parent = document.getElementById('search-container').parentNode;
    parent.insertBefore(spacer, null);

}

export async function getAllPosts(queryRef) {
    if (queryRef == null) {
        queryRef = postCollection;
    }

    const posts = CacheDB.getAllCachedPosts();

    const prevURL = CacheDB.getPreviousURL();
    if (prevURL != null) {
        if (prevURL.localeCompare(window.location.href) == 0) {
            console.log("Fetching from db...");
            let postArray = await getMultiplePosts(queryRef);
            CacheDB.cacheAllPosts(postArray);
            return postArray;
        }
    } else if (posts.length == 0 || prevURL == null) {
        console.log("Fetching from db...");
        let postArray = await getMultiplePosts(queryRef);
        CacheDB.cacheAllPosts(postArray);
        return postArray;
    }

    console.log("Rendering cached data.");
    return posts;
}

export async function searchByFilters(formId, e) {
    const form = new FormData(document.getElementById(formId));
    await displayPosts(queryPosts(form.get('Grade'), form.get('Star Rating'), form.get('Climb Type')));
    document.getElementById('search-button').disabled = false;
}

export async function openPost(postId) {
    window.location.href = "https://communitycrag.com/viewpost?" + postId;
}