import { Post } from "./post.js";

export const CacheDB = (function () {

    const dbName = 'post-data';
    const signedInKey = 'signed-in'
    const uidKey = 'uid';
    const usernameKey = 'username';
    let nonPostKeys = [signedInKey, uidKey, usernameKey];
    let storage = window.sessionStorage;

    function cacheAllPosts(postArray) {
        removeAllPosts();

        postArray.forEach(function(post) {
            cachePost(post);
        });
    }

    function markSignedIn() {
        storage.setItem(signedInKey, 'true');
    }

    function markSignedOut() {
        storage.setItem(signedInKey, 'false');
    }

    function getIsSignedIn() {
        return storage.getItem(signedInKey) === 'true';
    }

    function setUID(uid) {
        storage.setItem(uidKey, uid);
    }

    function getUID() {
        return storage.getItem(uidKey);
    }

    function clearUID() {
        storage.removeItem(uidKey);
    }

    function setUserame(username) {
        storage.setItem(usernameKey, username);
    }

    function getUsername() {
        return storage.getItem(usernameKey);
    }

    function signIn(uid) {
        setUID(uid);
        markSignedIn();
    }

    function signOut() {
        storage.removeItem(usernameKey);
        clearUID();
        markSignedOut();
    }

    // Define the addData() function
    function cachePost(post) {
        storage.setItem(post.getPostId(), JSON.stringify(postToObject(post)));
    }

    function removePost(postId) {
        storage.removeItem(String(postId));
    }

    function removeAllPosts() {
        let postIds = Object.keys(storage);

        postIds.forEach(function(postId) {
            if (nonPostKeys.indexOf(postId) == -1) {
                removePost(postId);
            }
        });
    }

    function getCachedPost(postId) {
        const storageVal = storage.getItem(postId);
        if (storageVal == null) {
            return null;
        }

        const postObject = JSON.parse(storageVal);
        return objectToPost(postObject);
    }

    function getAllCachedPosts(query = null) {
        let postIds = Object.keys(storage);
        let postList = [];

        postIds.forEach(function(postId) {
            if (nonPostKeys.indexOf(postId) == -1) {
                postList.push(getCachedPost(postId));
            }
        });

        return postList;
    }

    /*
     * Query all cached posts given query filters:
     *  [ Grade , Climb Type , Number of Stars ]
    */

    function queryPosts(postList, query, queryName) {
        let queriedList = [];

        postList.forEach(function(post) {
            if (nonPostKeys.indexOf(post.getPostId()) == -1) {
                if (queryName === "grade") {
                    let grade = post.getNumericalGrade();
                    if (grade >= query && grade < query + 1) {
                        queriedList.push(post);
                    }
                } else if (queryName === "stars") {
                    let stars = post.getStarRating();
                    if (stars == query) {
                        queriedList.push(post);
                    }
                } else if (queryName === "type") {
                    let type = post.getClimbType();
                    if (type == query) {
                        queriedList.push(post);
                    }
                }
            }
        });

        return queriedList;
    }

    function postToObject(post) {
        let suggestionsString = "";
        let suggestions = post.getUserSuggestionList();
        let keys = Object.keys(suggestions);
        keys.forEach(function(key) {
            suggestionsString += key + "=" + suggestions[key] + " ";
        })

        return {
            postTime: post.getNumericPostTime(),
            postId: post.getPostId(),
            setterUID: post.getSetterUID(),
            setterName: post.getSetterName(),
            name: post.getName(),
            image: post.getImage(),
            aspectRatio: post.getAspectRatio(),
            grade: post.getNumericalGrade(),
            gradeCount: post.getGradeCount(),
            comment: post.getComment(),
            climbType: post.getClimbType(),
            starRating: post.getStarRating(),
            userList: suggestionsString
        };
    }

    function objectToPost(object) {
        let suggestionsString = object.userList;
        let keyValuePairs = suggestionsString.split(" ");
        let suggestionList = {};

        keyValuePairs.forEach(function(keyValue) {
            if (keyValue.localeCompare("") != 0) {
                let pair = keyValue.split('=');
                suggestionList[pair[0]] = pair[1];
            }
        });

        return new Post(object.postTime, object.postId, object.setterUID, object.setterName, object.name, object.image, object.aspectRatio, object.comment, object.climbType, object.grade, object.gradeCount, object.starRating, suggestionList);
    }

    return {
        dbName: dbName,
        cacheAllPosts: cacheAllPosts,
        markSignedIn: markSignedIn,
        markSignedOut: markSignedOut,
        getIsSignedIn: getIsSignedIn,
        setUID: setUID,
        getUID: getUID,
        clearUID: clearUID,
        setUserame: setUserame,
        getUsername: getUsername,
        signIn: signIn,
        signOut: signOut,
        cachePost: cachePost,
        removePost: removePost,
        removeAllPosts: removeAllPosts,
        getCachedPost: getCachedPost,
        getAllCachedPosts: getAllCachedPosts,
        postToObject: postToObject,
        objectToPost: objectToPost
    };
})();