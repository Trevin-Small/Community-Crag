import { postCollection } from './index';
import { getMultiplePosts } from './post.js';
import { CacheDB } from './cache.js';

export function homeRedirect() {
    const baseUrl = "https://communitycrag.com";
    window.location.href = baseUrl;
}

export async function getAllPosts(queryRef, forceUpdate = false) {
    if (queryRef == null) {
        queryRef = postCollection;

        if (isNewSession() || refreshedHomePage() || forceUpdate) {
            console.log("Fetching from db...");
            let postArray = await getMultiplePosts(queryRef);
            CacheDB.cacheAllPosts(postArray);
            return postArray;
        }

    } else {
        console.log("Fetching from db...");
        return await getMultiplePosts(queryRef);
    }

    console.log("Rendering cached data.");
    return CacheDB.getAllCachedPosts();
}

function refreshedHomePage() {
    const prevURL = CacheDB.getPreviousURL();
    if (prevURL != null && prevURL.localeCompare(window.location.href) == 0) {
        CacheDB.clearPreviousURL();
        return true;
    }
    return false;
}

function isNewSession() {
    return CacheDB.getAllCachedPosts().length == 0;
}
