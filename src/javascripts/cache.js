import { Post } from "./post.js";

export class CacheDB {

    static dbName = 'post-data';
    static prevURL = 'prev-URL';
    static storage = window.sessionStorage;

    static cacheAllPosts(posts) {
        //this.storage.clear();
        posts.forEach((post) => {
            this.cachePost(post);
        });

        this.updatePreviousURL(window.location.href);
    }

    static updatePreviousURL(url) {
        this.storage.setItem(this.prevURL, url);
    }

    static getPreviousURL() {
        return this.storage.getItem(this.prevURL);
    }

    // Define the addData() function
    static cachePost(post) {
        const postObject = this.postToObject(post);
        this.storage.setItem(post.getPostId(), JSON.stringify(postObject));
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
            if (postId.localeCompare(this.prevURL) != 0) {
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
            userList: post.getUserSuggestionList()
        };
    }

    static objectToPost (object) {
        return new Post(object.postTime, object.postId, object.setterUID, object.setterName, object.name, object.image, object.comment,
                        object.climbType, object.grade, object.gradeCount, object.starRating, object.userList);
    }
}

export function updatePreviousURL(url) {
    CacheDB.updatePreviousURL(url);
}