import { postCollection } from './index';
import { getMultiplePosts } from './post.js';
import { CacheDB } from './cache.js';

export function homeRedirect() {
    const baseUrl = "https://communitycrag.com";
    window.location.href = baseUrl;
}

export async function getAllPosts(queryRef, forceUpdate = false) {
    console.log(queryRef);
    if (queryRef == null) {
        queryRef = postCollection;

        console.log("Is new session: " + isNewSession());
        const refreshed = refreshedHomePage();
        console.log("Refreshed: " + refreshed);

        if (isNewSession() || refreshed || forceUpdate) {
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
    const prevURL = CacheDB.getPreviousURL();
    if (prevURL == null && CacheDB.getAllCachedPosts().length == 0) {
        return true;
    }
    return false;
}
