import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { constructPostObject } from './post.js';
import { CacheDB } from './cache.js';
import {
    storage,
    verticalImageTransformation,
    horizontalImageTransformation,
    firebaseBaseURL
} from '../init';

export const CragDB = (function () {

    /*
    * Add a new post to firestore
    */

    async function addPost(db, collectionName, post) {

        const collectionRef = collection(db, collectionName);

        try {
            const data = {
                postTime: post.getNumericPostTime(),
                setterUID: post.getSetterUID(),
                setterName: post.getSetterName(),
                name: post.getName(),
                image: post.getImage(),
                isVerticalImage: post.getIsVerticalImage(),
                grade: post.getNumericalGrade(),
                gradeCount: post.getGradeCount(),
                comment: post.getComment(),
                climbType: post.getClimbType(),
                starRating: post.getStarRating(),
                userList: post.getUserSuggestionList()
            };
            await addDoc(collectionRef, data);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } /* addPost() */


    /*
    * Update the Grade data on an existing post in firestore
    */

    async function updatePostGrade(db, collectionName, postId, post) {

        const postRef = doc(db, collectionName, postId);

        try {
            const data = {
                grade: post.getNumericalGrade(),
                gradeCount: post.getGradeCount(),
                userList: post.getUserSuggestionList()
            }
            await setDoc(postRef, data, { merge: true });
        } catch (e) {
            console.error("Error editing document: ", e);
        }
    } /* updatePostGrade() */


    /*
    * Get one post from firestore
    */

    async function getPost(db, collectionName, postId) {

        const postRef = doc(db, collectionName, postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            return constructPostObject(postDoc);
        }

        return null;
    } /* getPost() */


    /*
     * Get all posts that meet the query. If the query is all posts, check for Cached data before fetching from the db.
     * Returns: postArray
     */

    async function getAllPosts(queryRef, db, collectionName, forceUpdate = false) {

        if (queryRef != null) {
            console.log("Fetching from db...");
            return await queryPosts(queryRef);
        }

        queryRef = collection(db, collectionName);

        if (isNewSession() || refreshedHomePage() || forceUpdate) {
            console.log("Fetching from db...");
            let postArray = await queryPosts(queryRef);
            CacheDB.cacheAllPosts(postArray);
            return postArray;
        } else {
            console.log("Rendering cached data.");
            return CacheDB.getAllCachedPosts();
        }
    } /* getAllPosts() */


    /*
     * Input search parameters (grade, star rating, climb type, OR a time) and return a query object that meets those parameters
    */

    function newQuery(db, collectionName, grade, starRating, climbType, time = null) {

        const dbCollection = collection(db, collectionName);

        if (grade != null && starRating != null && climbType != null) {

            grade = parseInt(grade);
            grade = grade == -1 ? null : grade;
            starRating = parseInt(starRating);
            starRating = starRating == 0 ? null : starRating;

            if (climbType == 1) {
                climbType = "Overhang";
            } else if (climbType == 2) {
                climbType = "Slab";
            } else if (climbType == 3) {
                climbType = "Mixed";
            } else if (climbType == 4) {
                climbType = "Vertical";
            } else if (climbType == 5) {
                climbType = "Other";
            } else {
                climbType = null;
            }

            // If searching for V10, include all climbs V10+
            let gradeSearchRange = 1;
            if (grade == 10) {
                gradeSearchRange = 10;
            }

            // All possible Query Combinations
            if (grade != null && starRating != null && climbType != null) {
                return query(dbCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("starRating", "==", starRating), where("climbType", "==", climbType));

            } else if (grade != null && starRating != null) {
                return query(dbCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("starRating", "==", starRating));

            } else if (grade != null && climbType != null) {
                return query(dbCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("climbType", "==", climbType));

            } else if (starRating != null && climbType != null) {
                return query(dbCollection, where("starRating", "==", starRating), where("climbType", "==", climbType));

            } else if (grade != null) {
                return query(dbCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange));

            } else if (climbType != null) {
                return query(dbCollection, where("climbType", "==", climbType));

            } else if (starRating != null) {
                return query(dbCollection, where("starRating", "==", starRating));

            }
        } else {

            if (time != null) {
                return query(dbCollection, where("postTime", "<=", time));
            } else {
                return null;
            }
        }
    } /* newQuery() */


    /*
    * Query firestore and retreive posts that meet the criteria
    */

    async function queryPosts(queryRef) {

        let postArray = [];
        let dbPosts = await getDocs(queryRef);

        dbPosts.forEach((postDoc) => {
            let post = constructPostObject(postDoc);
            postArray.push(post);
        });

        return postArray;
    } /* getMultiplePosts() */


    /*
    * Delete a post entirely, removing its data on firestore and in cloud storage
    */

    async function deletePost(db, collectionName, postId, post = null) {

        const docRef = doc(db, collectionName, postId);

        if (post == null) {
            post = CacheDB.getCachedPost(postId);
        }

        await deleteCloudImage(post.getImage());
        await deleteDoc(docRef);
        CacheDB.removePost(postId);
    } /* deletePost() */

    async function loadImageFile(image) {
        return new Promise((resolve, reject) => {

            let reader = new FileReader();

            //Read the contents of Image File.
            reader.readAsDataURL(image);
            reader.onload = function (e) {

                // Initiate the JavaScript Image object.
                let image = new Image();

                // Set the Base64 string return from FileReader as source.
                image.src = e.target.result;

                // Resolve whether the image is vertical or not, and its src (base64 url for display)
                image.onload = function () {
                    resolve([this.width < this.height, image.src]);
                };

                image.src = e.target.result;
            };

            reader.onerror = reject;

        });
    }


    /*
     * Upload a given image file to cloud storage and return its URL
    */

    async function uploadCloudImage(directoryName, postTime, uid, image) {

        const imageData = await loadImageFile(image);
        const isVertical = imageData[0];

        // Pass the user's uid as metadata to the image
        // -------------------------------------------------------
        // This allows for storage rules to ensure that a user
        // requesting to delete an image is the owner of the image.
        const metadata = {
            customMetadata: {
                'uid': uid
            }
        };

        const storageRef = ref(storage, directoryName + "/" + uid + "/" + postTime);
        // Upload image to firebase storage
        await uploadBytes(storageRef, image, metadata);
        return [await getCloudImage(storageRef, isVertical), isVertical];

    } /* uploadCloudImage() */


    /*
     * Get the URL of a given image reference
    */

    async function getCloudImage(storageRef, orientation) {
        const forwardSlash = "%2F";
        let photoOrientationTransform = "";

        if (orientation == true) {
            photoOrientationTransform = verticalImageTransformation;
        } else {
            photoOrientationTransform = horizontalImageTransformation;
        }

        let imageURL = null;
        // Get the url of the image
        await getDownloadURL(storageRef).then((url) => {
            imageURL = url.replace(firebaseBaseURL, "").replace("%2F", "/");
        });

        return imageURL;
    } /* getCloudImage() */


    /*
     * Delete an image from cloud storage by URL
    */

    async function deleteCloudImage(url) {
        url = firebaseBaseURL + url;
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
    } /*deleteCloudImage() */


    return {
        addPost: addPost,
        getPost: getPost,
        getAllPosts: getAllPosts,
        deletePost: deletePost,
        updatePostGrade: updatePostGrade,
        newQuery: newQuery,
        queryPosts: queryPosts,
        loadImageFile: loadImageFile,
        uploadCloudImage: uploadCloudImage
    };

})();

// ----------------------------------------------------------------------------------->
// These functions dont belong in this file. Need to find a new solution...

function refreshedHomePage() {
    const prevURL = CacheDB.getPreviousURL();

    if (prevURL != null && prevURL.localeCompare(window.location.href) == 0) {
        CacheDB.clearPreviousURL();
        return true;
    }
    return false;
}

function isNewSession() {
    return CacheDB.getAllCachedPosts().length == 0;
}
