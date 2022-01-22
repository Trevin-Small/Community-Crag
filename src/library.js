import { displayPosts, searchByFilters, openPost, updateNavBar } from './javascripts/explorePosts.js';
import { pushPostToFireBase, fileUploaded } from './javascripts/createPost.js';
import { viewPost } from './javascripts/viewPost.js';
import { signIn, signUp, logOut } from './javascripts/auth.js';
import { submitPost } from './javascripts/createPost.js';

// Expose all functions that need to be avaialable client-side after webpack bundle
export { 
    displayPosts, 
    searchByFilters, 
    openPost, 
    updateNavBar, 
    pushPostToFireBase, 
    fileUploaded, 
    viewPost, 
    signIn, 
    signUp, 
    logOut, 
    submitPost
};