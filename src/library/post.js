/*
 * Post object that encapsulates all important information about a user's post.
 * Provides methods for getting and setting values, as well as useful methods
 * like the render function which creates HTML elements to display its data
 * on the home query page.
*/

export class Post {

    constructor(postTime, postId, setterUID, setterName, name, image, comment, climbType, grade, gradeCount, starRating, userSuggestionList) {

        this.INITIAL_GRADE_COUNT = 2;

        this.postTime = postTime;
        this.postId = postId;
        this.setterUID = setterUID;
        this.setterName = setterName;
        this.name = name;
        this.image = image;

        if (grade - Math.floor(grade) == 0) {
            this.grade = grade + 0.5;
        } else {
            this.grade = grade;
        }

        this.gradeCount = gradeCount;
        this.comment = comment;
        this.starRating = starRating;
        this.climbType = climbType;
        this.userSuggestionList = userSuggestionList;
    }

    getInitialGradeCount() {
        return this.INITIAL_GRADE_COUNT;
    }

    getNumericPostTime() {
        return this.postTime;
    }

    getPostTime() {
        const dateObject = new Date(this.postTime * 10000);
        const month = dateObject.toLocaleString("en-US", { month: "numeric" }) // December
        const day = dateObject.toLocaleString("en-US", { day: "numeric" }) // 9
        const year = dateObject.toLocaleString("en-US", { year: "numeric" }) // 2019
        return month + "/" + day + "/" + (year % 1000);
    }

    getPostId() {
        return this.postId;
    }

    getSetterUID() {
        return this.setterUID;
    }

    getSetterName() {
        return this.setterName;
    }

    getName() {
        return this.name;
    }

    getImage() {
        return this.image;
    }

    getNumericalGrade() {
        return this.grade;
    }

    getGrade() {

        /* Prevent showing + and - grades on V0 & V1 */

        if (this.grade < 2) {
            return "V" + parseInt(Math.floor(this.grade));
        }

        if (this.grade - Math.floor(this.grade) >= 0.75) {
            return "V" + Math.floor(this.grade) + "+";
        } else if (this.grade - Math.floor(this.grade) <= 0.25) {
            return "V" + Math.floor(this.grade) + "-";
        } else {
            return "V" + Math.floor(this.grade);
        }
    }

    getComment() {
        return this.comment;
    }

    getGradeCount() {
        return this.gradeCount;
    }

    getStarRating() {
        return Math.round(this.starRating);
    }

    getClimbType() {
        return this.climbType;
    }

    getUserSuggestionList() {
        return this.userSuggestionList;
    }

    getUserSuggestion(uid) {
        if (uid in this.userSuggestionList) {
            return this.userSuggestionList[uid];
        } else {
            return 0;
        }
    }

    setName(name) {
        this.name = name;
    }

    setImage(image) {
        this.image = image;
    }

    setGrade(grade) {
        this.grade = grade + 0.5;
    }

    setComment(comment) {
        this.comment = comment;
    }

    resetGradeCount() {
        this.gradeCount = 1;
    }

    setUserSuggestion(suggestion, uid) {
        this.userSuggestionList[uid] = suggestion;
    }

    setUserSuggestionList(userSuggestionList) {
        this.userSuggestionList = userSuggestionList;
    }

    suggestGrade(suggestionNum, uid) {
        this.setUserSuggestion(suggestionNum, uid);

        /* Disallow downvoting grades lower than 0 and higher than 15 */

        if (this.getNumericalGrade < 1) {
            this.grade = 0.5;
            return;
        } else if (this.getNumericalGrade() >= 15.25) {
            this.grade = 15.5;
            return;
        }

        this.gradeCount++;
        const voteWeight = 1 / this.gradeCount;

        // Old grade * weight per vote * total number of votes prior to vote
        const previousGradeWeight = this.grade * (this.gradeCount - 1) * voteWeight;

        // Suggested Grade * weight per vote * 1 vote
        const suggestedGradeWeight = (this.grade + suggestionNum) * voteWeight;
        this.grade = Math.floor((previousGradeWeight + suggestedGradeWeight) * 100) / 100;

        return this.grade;
    }

    newPostData() {
        return {
            postTime: this.getNumericPostTime(),
            setterUID: this.getSetterUID(),
            setterName: this.getSetterName(),
            name: this.getName(),
            image: this.getImage(),
            grade: this.getNumericalGrade(),
            gradeCount: this.getGradeCount(),
            comment: this.getComment(),
            climbType: this.getClimbType(),
            starRating: this.getStarRating(),
            userList: this.getUserSuggestionList()
        };
    }

    updateGradeData() {
        return {
            grade: this.getNumericalGrade(),
            gradeCount: this.getGradeCount(),
            userList: this.getUserSuggestionList()
        };
    }

    renderPostList(baseElementId, postId) {
        let element = document.getElementById(baseElementId);
        let clone = element.cloneNode(true);
        clone.id = postId;
        clone.querySelector('#post-container').setAttribute('id', postId);
        clone.querySelector('#post-name').innerHTML = this.name;
        clone.querySelector('#hidden-post-name').innerHTML = this.name;
        clone.querySelector('#post-grade').innerHTML = this.getGrade();
        clone.querySelector('#post-image').src = this.image;
        clone.querySelector('#climb-type').innerHTML = this.climbType;
        let postComment = clone.querySelector('#post-comment');

        const maxChars = (window.innerWidth / 700) * 150;
        if (this.comment.length >= maxChars) {
            postComment.innerHTML = this.comment.slice(0, maxChars) + '...';
        } else {
            postComment.innerHTML = this.comment;
        }

        let gradeCount = clone.querySelector('#count');

        if (this.gradeCount <= this.INITIAL_GRADE_COUNT) {
            gradeCount.style.visibility = 'hidden';
        } else {
            gradeCount.style.visibility = 'visible';
            gradeCount.innerHTML = (this.gradeCount - this.INITIAL_GRADE_COUNT) + " Grade Suggestions";
        }

        if (this.starRating >= 1) {
            let starOne = clone.querySelector("#star-one");
            starOne.src = './assets/star.svg';
        } else {
            let starOne = clone.querySelector("#star-one");
            starOne.src = './assets/star-empty.svg';
        }

        if (this.starRating >= 2) {
            let starTwo = clone.querySelector("#star-two");
            starTwo.src = './assets/star.svg';
        } else {
            let starTwo = clone.querySelector("#star-two");
            starTwo.src = './assets/star-empty.svg';
        }

        if (this.starRating >= 3) {
            let starThree = clone.querySelector("#star-three");
            starThree.src = './assets/star.svg';
        } else {
            let starThree = clone.querySelector("#star-three");
            starThree.src = './assets/star-empty.svg';
        }

        if (this.starRating >= 4) {
            let starFour = clone.querySelector("#star-four");
            starFour.src = './assets/star.svg';
        } else {
            let starFour = clone.querySelector("#star-four");
            starFour.src = './assets/star-empty.svg';
        }

        if (this.starRating >= 5) {
            let starFive = clone.querySelector("#star-five");
            starFive.src = './assets/star.svg';
        } else {
            let starFive = clone.querySelector("#star-five");
            starFive.src = './assets/star-empty.svg';
        }

        let parent = document.getElementById('search-container').parentNode;
        parent.insertBefore(clone, null);
    }

    renderViewPost() {

        document.getElementById('page-title').innerHTML = "Crag | " + this.name;

        let element = document.getElementById('post-container');
        element.querySelector('#post-name').innerHTML = this.name;
        element.querySelector('#post-info').innerHTML = this.setterName + " - " + this.getPostTime();
        element.querySelector('#post-image').src = this.image;
        element.querySelector('#post-grade').innerHTML = this.getGrade();
        element.querySelector('#post-comment').innerHTML = this.comment;
        element.querySelector('#climb-type').innerHTML = this.climbType;
        if (this.gradeCount > this.INITIAL_GRADE_COUNT) {
            element.querySelector('#grade-count').innerHTML = (this.gradeCount - this.INITIAL_GRADE_COUNT) + " Grade Suggestions";
        } else {
            element.querySelector('#grade-count').style.display = 'none';
        }

        let starOne = element.querySelector("#star-one");
        if (this.starRating >= 1) {
            starOne.src = './assets/star.svg';
        } else {
            starOne.src = './assets/star-empty.svg';
        }

        let starTwo = element.querySelector("#star-two");
        if (this.starRating >= 2) {
            starTwo.src = './assets/star.svg';
        } else {
            starTwo.src = './assets/star-empty.svg';
        }

        let starThree = element.querySelector("#star-three");
        if (this.starRating >= 3) {
            starThree.src = './assets/star.svg';
        } else {
            starThree.src = './assets/star-empty.svg';
        }

        let starFour = element.querySelector("#star-four");
        if (this.starRating >= 4) {
            starFour.src = './assets/star.svg';
        } else {
            starFour.src = './assets/star-empty.svg';
        }

        let starFive = element.querySelector("#star-five");
        if (this.starRating >= 5) {
            starFive.src = './assets/star.svg';
        } else {
            starFive.src = './assets/star-empty.svg';
        }
    }

    toString() {
        return "Name: " + this.name + "\nGrade: " + this.grade + "\nStar Rating: " + this.starRating + "\nComment: " + this.comment;
    }
} /* class Post() */

/*
 * A sort of wrapper for constructor so its easier to modify the post class without changing
 * the functions that get data from the db and convert it to post objects
*/

export function constructPostObject(postDoc) {
    const postData = postDoc.data();
    return new Post(postData.postTime, postDoc.id, postData.setterUID, postData.setterName, postData.name, postData.image, postData.comment,
        postData.climbType, postData.grade, postData.gradeCount, postData.starRating, postData.userList);
} /* constructPostObject() */

/*
 * Javascript doesnt support overloading, so this is basically an alternate "constructor"
*/

export function createNewPostObject(postTime, setterUID, setterName, postName, imageUrl, comment, climbType, grade, starRating) {
    return new Post(postTime, null, setterUID, setterName, postName, imageUrl, comment, climbType, grade, Post.getInitialGradeCount(), starRating, {});
} /* newPostObject() */
