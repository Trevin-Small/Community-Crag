import { displayPosts, searchByFilters, openPost, updateNavBar } from './javascripts/explorePosts.js';
import { pushPostToFireBase, fileUploaded } from './javascripts/createPost.js';
import { viewPost } from './javascripts/viewPost.js';
import { signIn, signUp, isSignedIn, getUsername, logOut } from './javascripts/auth.js';

// Expose all functions that need to be avaialable client-side after webpack bundle
export { displayPosts, searchByFilters, openPost, updateNavBar, pushPostToFireBase, fileUploaded, viewPost, signIn, signUp, isSignedIn, getUsername, logOut };