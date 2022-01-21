import { displayPosts, searchByFilters, openPost, updateNavBar } from './javascripts/explorePosts.js';
import { pushPostToFireBase } from './javascripts/createPost.js';
import { viewPost } from './javascripts/viewPost.js';
import { signIn, signUp, isSignedIn, getUsername, logOut } from './javascripts/auth.js';

// Expose all functions that need to be avaialable client-side after webpack bundle
export { pushPostToFireBase, displayPosts, searchByFilters, openPost, updateNavBar, viewPost, signIn, signUp, isSignedIn, getUsername, logOut };