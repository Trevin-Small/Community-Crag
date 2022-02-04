import { displayPosts, searchByFilters, openPost } from './page_scripts/explore_posts.js';
import { fileUploaded, submitPost } from './page_scripts/create_post.js';
import { viewPost, showGradePopup, hideGradePopup, suggestGrade, showDeletePopup, hideDeletePopup, deletePostByURL } from './page_scripts/view_post.js';
import { signIn, signUp, logOut, sendPasswordReset, isAdmin } from './library/auth.js';
import { updatePreviousURL } from './library/cache.js';
import { deletePostsByDate } from './page_scripts/delete_by_date.js';

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
    showGradePopup,
    hideGradePopup,
    suggestGrade,
    showDeletePopup,
    hideDeletePopup,
    deletePostByURL,
    signIn,
    signUp,
    logOut,
    sendPasswordReset,
    isAdmin,
    submitPost,
    updatePreviousURL,
    deletePostsByDate
};