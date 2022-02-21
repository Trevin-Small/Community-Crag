import { CacheDB } from './cache.js';

export function homeRedirect() {
    const baseUrl = "https://communitycrag.com";
    window.location.href = baseUrl;
}

export function refreshedPage() {
    const prevURL = CacheDB.getPreviousURL();
    let urlMatch = false;

    if (prevURL != null && prevURL.localeCompare(window.location.href) == 0) {
        CacheDB.clearPreviousURL();
        urlMatch = true;
    }
    return urlMatch || isNewSession();
}

function isNewSession() {
    return CacheDB.getAllCachedPosts().length == 0;
}
