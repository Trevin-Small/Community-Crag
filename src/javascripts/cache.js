import { Post } from "./post.js";

export class CacheDB {

    static dbName = 'post-data';
    static signedIn = 'signed-in'
    static uid = 'uid';
    static prevURL = 'prev-URL';
    static storage = window.sessionStorage;

    static cacheAllPosts(posts) {
        //this.storage.clear();
        posts.forEach((post) => {
            this.cachePost(post);
        });

        this.updatePreviousURL(window.location.href);
    }

    static markSignedIn() {
        this.storage.setItem(this.signedIn, 'true');
    }

    static markSignedOut() {
        this.storage.setItem(this.signedIn, 'false');
    }

    static getIsSignedIn() {
        return this.storage.getItem(this.signedIn) === 'true';
    }

    static setUID(uid) {
        this.storage.setItem(this.uid, uid);
    }

    static clearUID() {
        this.storage.removeItem(this.uid);
    }

    static getUID() {
        return this.storage.getItem(this.uid);
    }

    static updatePreviousURL(url) {
        this.storage.setItem(this.prevURL, url);
    }

    static getPreviousURL() {
        return this.storage.getItem(this.prevURL);
    }

    // Define the addData() function
    static cachePost(post) {
        this.storage.setItem(post.getPostId(), JSON.stringify(this.postToObject(post)));
    }

    static removePost(postId) {
        this.storage.removeItem(String(postId));
    }

    static getCachedPost(postId) {
        const storageVal = this.storage.getItem(postId);
        const postObject = JSON.parse(storageVal);
        return this.objectToPost(postObject);
    }

    static getAllCachedPosts(query = null) {
        let postIds = Object.keys(this.storage);
        let postList = [];

        postIds.forEach((postId) => {
            if (postId.localeCompare(this.prevURL) != 0 && postId.localeCompare(this.signedIn) != 0 && postId.localeCompare(this.uid) != 0) {
                postList.push(this.getCachedPost(postId));
            }
        });

        return postList;
    }

    /*
     * Query all cached posts given query filters:
     *  [ Grade , Climb Type , Number of Stars ]
    */

    static queryCachedPosts(queries) {

    }

    static postToObject (post) {
        let suggestionsString = "";
        let suggestions = post.getUserSuggestionList();
        let keys = Object.keys(suggestions);
        keys.forEach((key) => {
            suggestionsString += key + "=" + suggestions[key] + " ";
        })

        return {
            postTime: post.getNumericPostTime(),
            postId: post.getPostId(),
            setterUID: post.getSetterUID(),
            setterName: post.getSetterName(),
            name: post.getName(),
            image: post.getImage(),
            grade: post.getNumericalGrade(),
            gradeCount: post.getGradeCount(),
            comment: post.getComment(),
            climbType: post.getClimbType(),
            starRating: post.getStarRating(),
            userList: suggestionsString
        };
    }

    static objectToPost (object) {
        let suggestionsString = object.userList;
        let keyValuePairs = suggestionsString.split(" ");
        let suggestionList = {};

        keyValuePairs.forEach((keyValue) => {
            if (keyValue.localeCompare("") != 0) {
                let pair = keyValue.split('=');
                suggestionList[pair[0]] = pair[1];
            }
        });

        return new Post(object.postTime, object.postId, object.setterUID, object.setterName, object.name, object.image, object.comment,
                        object.climbType, object.grade, object.gradeCount, object.starRating, suggestionList);
    }
}

export function updatePreviousURL(url) {
    CacheDB.updatePreviousURL(url);
}