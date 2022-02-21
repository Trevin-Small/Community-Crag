import { refreshedPage, homeRedirect } from '../library/shared_functions.js';
import { db, imageStorageName, postCollectionName } from '../init';
import { createNewPostObject } from '../library/post.js';
import { getUsername, isValidUser } from '../library/auth.js';
import { isSignedIn } from '../library/auth.js';
import { CragDB } from '../library/crag_db.js';
import { CacheDB } from '../library/cache.js';
import { Errors } from '../library/errors.js';

export {
    // Const Variables
    db,
    imageStorageName,
    postCollectionName,

    // Functions
    homeRedirect,
    refreshedPage,
    createNewPostObject,
    getUsername,
    isValidUser,
    isSignedIn,

    // Closures & Classes
    CragDB,
    CacheDB,
    Errors,
}