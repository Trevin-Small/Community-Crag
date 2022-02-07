import { CacheDB } from './cache.js';
import { getUsername } from './auth.js';

export function homeRedirect() {
    const baseUrl = "https://communitycrag.com";
    window.location.href = baseUrl;
}