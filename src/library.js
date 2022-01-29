import { displayPosts, searchByFilters, openPost } from './javascripts/explorePosts.js';
import { fileUploaded, submitPost } from './javascripts/createPost.js';
import { viewPost, showSuggestGrade, hideSuggestGrade, suggestGrade, showDelete, hideDelete, deletePost } from './javascripts/viewPost.js';
import { signIn, signUp, logOut } from './javascripts/auth.js';

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
    submitPost
};