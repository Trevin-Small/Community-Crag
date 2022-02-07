import { Post } from "./post.js";

export class CacheDB {

    static dbName = 'post-data';
    static signedIn = 'signed-in'
    static uid = 'uid';
    static username = 'username';
    static prevURL = 'prev-URL';
    static nonPostKeys = [this.signedIn, this.uid, this.username, this.prevURL];
    static storage = window.sessionStorage;

    static cacheAllPosts(posts) {
        this.removeAllPosts();
        posts.forEach((post) => {
            this.cachePost(post);
        });
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

    static getUID() {
        return this.storage.getItem(this.uid);
    }

    static clearUID() {
        this.storage.removeItem(this.uid);
    }

    static setUserame(username) {
        this.storage.setItem(this.username, username);
    }

    static getUsername() {
        return this.storage.getItem(this.username);
    }

    static signIn(uid) {
        this.setUID(uid);
        this.markSignedIn();
    }

    static signOut() {
        this.storage.removeItem(this.username);
        this.clearUID();
        this.markSignedOut();
    }

    static updatePreviousURL(url) {
        this.storage.setItem(this.prevURL, url);
    }

    static getPreviousURL() {
        return this.storage.getItem(this.prevURL);
    }

    static clearPreviousURL() {
        this.storage.removeItem(this.prevURL);
    }

    // Define the addData() function
    static cachePost(post) {
        this.storage.setItem(post.getPostId(), JSON.stringify(this.postToObject(post)));
    }

    static removePost(postId) {
        this.storage.removeItem(String(postId));
    }

    static removeAllPosts() {
        let postIds = Object.keys(this.storage);

        postIds.forEach((postId) => {
            if (this.nonPostKeys.indexOf(postId) == -1) {
                this.removePost(postId);
            }
        });
    }

    static getCachedPost(postId) {
        const storageVal = this.storage.getItem(postId);
        if (storageVal == null) {
            return null;
        }
        const postObject = JSON.parse(storageVal);
        return this.objectToPost(postObject);
    }

    static getAllCachedPosts(query = null) {
        let postIds = Object.keys(this.storage);
        let postList = [];

        postIds.forEach((postId) => {
            if (this.nonPostKeys.indexOf(postId) == -1) {
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

    static postToObject(post) {
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

    static objectToPost(object) {
        let suggestionsString = object.userList;
        let keyValuePairs = suggestionsString.split(" ");
        let suggestionList = {};

        keyValuePairs.forEach((keyValue) => {
            if (keyValue.localeCompare("") != 0) {
                let pair = keyValue.split('=');
                suggestionList[pair[0]] = pair[1];
            }
        });

        return new Post(object.postTime, object.postId, object.setterUID, object.setterName, object.name, object.image, object.comment, object.climbType, object.grade, object.gradeCount, object.starRating, suggestionList);
    }
}

export function updatePreviousURL(url) {
    CacheDB.updatePreviousURL(url);
}