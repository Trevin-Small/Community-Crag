import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { constructPostObject } from './post.js';
import { CacheDB } from './cache.js';
import { storage } from '../init';

export class CragDB {

    /*
    * Add a new post to firestore
    */

    static async addPost(db, collectionName, post) {

        const collectionRef = collection(db, collectionName);

        try {
            const data = {
                postTime: post.getNumericPostTime(),
                setterUID: post.getSetterUID(),
                setterName: post.getSetterName(),
                name: post.getName(),
                image: post.getImage(),
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

    static async updatePostGrade(db, collectionName, postId, post) {

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

    static async getPost(db, collectionName, postId) {

        const postRef = doc(db, collectionName, postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
            return constructPostObject(postDoc);
        }

        return null;
    } /* getPost() */


    /*
    * Get all posts that meet the query. If the query is all posts, check for Cached data before fetching from the db.
    */

    static async getAllPosts(queryRef, db, collectionName, forceUpdate = false) {

        if (queryRef != null) {
            console.log("Fetching from db...");
            return await this.queryPosts(queryRef);
        }

        queryRef = collection(db, collectionName);

        if (isNewSession() || refreshedHomePage() || forceUpdate) {
            console.log("Fetching from db...");
            let postArray = await this.queryPosts(queryRef);
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

    static newQuery(db, collectionName, grade, starRating, climbType, time = null) {

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
                console.log("1");
                return query(dbCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("starRating", "==", starRating), where("climbType", "==", climbType));

            } else if (grade != null && starRating != null) {
                console.log("2");
                return query(dbCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("starRating", "==", starRating));

            } else if (grade != null && climbType != null) {
                console.log("3");
                return query(dbCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("climbType", "==", climbType));

            } else if (starRating != null && climbType != null) {
                console.log("4");
                return query(dbCollection, where("starRating", "==", starRating), where("climbType", "==", climbType));

            } else if (grade != null) {
                console.log("5");
                return query(dbCollection, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange));

            } else if (climbType != null) {
                console.log("6");
                return query(dbCollection, where("climbType", "==", climbType));

            } else if (starRating != null) {
                console.log("7");
                return query(dbCollection, where("starRating", "==", starRating));

            } else {

                return null;

            }
        } else {

            if (time != null) {
                console.log("querying by time...");
                return query(dbCollection, where("postTime", "<=", time));
            } else {
                return null;
            }
        }
    } /* newQuery() */


    /*
    * Query firestore and retreive posts that meet the criteria
    */

    static async queryPosts(queryRef) {

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

    static async deletePost(db, collectionName, postId, post = null) {

        const docRef = doc(db, collectionName, postId);

        if (post == null) {
            post = CacheDB.getCachedPost(postId);
        }

        await this.deleteCloudImage(post.getImage());
        await deleteDoc(docRef);
        CacheDB.removePost(postId);
    } /* deletePost() */


    /*
     * Upload a given image file to cloud storage and return its URL
    */

    static async uploadCloudImage(directoryName, postTime, image) {

        function readFileAsync(file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();

                reader.onload = function (e) {
                    let image = new Image();

                    image.onload = function () {
                        console.log("Width: " + this.width + ", Height: " + this.height);
                        resolve([this.width, this.height]);
                    };

                    image.src = e.target.result;
                };

                reader.onerror = reject;

                reader.readAsDataURL(file);
            })
        }

        const dimensions = await readFileAsync(image[0]);
        const width = dimensions[0];
        const height = dimensions[1];

        let orientation = 0;
        if (height > width) {
            orientation = 1;
        } else if (width > height) {
            orientation = -1;
        }

        console.log("Orientation: " + orientation);

        const storageRef = ref(storage, directoryName + postTime);
        // Upload image to firebase storage
        await uploadBytes(storageRef, image[0]);
        return await this.getCloudImage(storageRef, orientation);

    } /* uploadCloudImage() */


    /*
     * Get the URL of a given image reference
    */

    static async getCloudImage(storageRef, orientation) {

        const verticalImageTransform = "tr:w-1500,h-2000/";
        const horizontalImageTransform = "tr:w-2000,h-1500/";
        let photoOrientationTransform = "";

        if (orientation == 1) {
            photoOrientationTransform = verticalImageTransform;
        } else if (orientation == -1) {
            photoOrientationTransform = horizontalImageTransform;
        }

        console.log("Photo Transform: " + photoOrientationTransform);

        let imageUrl = null;
        // Get the url of the image
        await getDownloadURL(storageRef).then((url) => {
            imageUrl = url.replace("https://firebasestorage.googleapis.com/v0/b/community-crag.appspot.com/o/purdue%2F", "https://ik.imagekit.io/communitycrag/" + photoOrientationTransform);
        });

        console.log(imageUrl);

        return imageUrl;
    } /* getCloudImage() */


    /*
     * Delete an image from cloud storage by URL
    */

    static async deleteCloudImage(url) {

        url = url.replace("https://ik.imagekit.io/communitycrag/tr:w-1500,h-2000/", "https://firebasestorage.googleapis.com/v0/b/community-crag.appspot.com/o/purdue%2F");
        url = url.replace("https://ik.imagekit.io/communitycrag/tr:w-2000,h-1500/", "https://firebasestorage.googleapis.com/v0/b/community-crag.appspot.com/o/purdue%2F");
        url = url.replace("https://ik.imagekit.io/communitycrag/", "https://firebasestorage.googleapis.com/v0/b/community-crag.appspot.com/o/purdue%2F");

        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
    } /*deleteCloudImage() */

}

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
