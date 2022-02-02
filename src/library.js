import { displayPosts, searchByFilters, openPost } from './javascripts/explorePosts.js';
import { fileUploaded, submitPost } from './javascripts/createPost.js';
import { viewPost, showSuggestGrade, hideSuggestGrade, suggestGrade, showDelete, hideDelete, deletePost } from './javascripts/viewPost.js';
import { signIn, signUp, logOut, sendPasswordReset } from './javascripts/auth.js';
import { updatePreviousURL } from './javascripts/cache.js';

//<------------------------->
//  ElOhEl  ( ͡° ͜ʖ ͡°)  ElOhEl
//<------------------------->

// Expose all functions that need to be avaialable client-side after webpack bundle
export {
    displayPosts,
    searchByFilters,
    openPost,
    fileUploaded,
    viewPost,
    showSuggestGrade,
    hideSuggestGrade,
    suggestGrade,
    showDelete,
    hideDelete,
    deletePost,
    signIn,
    signUp,
    logOut,
    sendPasswordReset,
    submitPost,
    updatePreviousURL
};