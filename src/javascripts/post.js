export class Post {
    constructor(postTime, uid, setterName, name, image, comment, climbType, grade, gradeCount, starRating) {
        this.postTime = postTime;
        this.uid = uid;
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
    }

    getNumericPostTime() {
        return this.postTime;
    }

    getPostTime() {
        const dateObject = new Date(this.postTime * 10000);
        const month = dateObject.toLocaleString("en-US", {month: "numeric"}) // December
        const day = dateObject.toLocaleString("en-US", {day: "numeric"}) // 9
        const year = dateObject.toLocaleString("en-US", {year: "numeric"}) // 2019
        return month + "/" + day + "/" + (year % 1000);
    }

    getUID() {
        return this.uid;
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

    resetGradeCount(){
        this.gradeCount = 1;
    }

    suggestGrade(isSuggestingHarder) {

        /* Disallow downvoting grades lower than 0 and higher than 15 */

        if (this.getNumericalGrade < 1) {
            this.grade = 0.5;
            return;
        } else if (this.getNumericalGrade() >= 15.25) {
            this.grade = 15.5;
            return;
        }

        let voteWeight = 1;

        if (!isSuggestingHarder) {
            voteWeight = -1;
        }

        this.gradeCount = this.gradeCount + 1;
        let suggestionWeight = 1 / this.gradeCount;
        this.grade = Math.round( (((this.gradeCount - 1) * suggestionWeight * this.grade) + (suggestionWeight * (voteWeight + this.grade))) * 1000 ) / 1000;
        return this.grade;

        /* Old code for when grading was open to any grade suggestion -> just a weighted average */
        /*
        this.gradeCount = this.gradeCount + 1;
        let suggestionWeight = 1 / this.gradeCount;
        this.grade = Math.round( (((this.gradeCount - 1) * suggestionWeight * this.grade) + (suggestionWeight * suggestedGrade)) * 1000 ) / 1000;
        return this.grade;
        */
    }

    renderPostList(baseElementId, docId) {
        let element = document.getElementById(baseElementId);
        let clone = element.cloneNode(true);
        clone.id = docId;
        clone.querySelector('#post-container').setAttribute('id',docId);
        clone.querySelector('#post-name').innerHTML = this.name;
        clone.querySelector('#hidden-post-name').innerHTML = this.name;
        clone.querySelector('#post-grade').innerHTML = this.getGrade();
        clone.querySelector('#post-image').src = this.image;
        clone.querySelector('#climb-type').innerHTML = this.climbType;
        let postComment = clone.querySelector('#post-comment');

        const maxChars = (window.innerWidth / 700) * 100;
        if (this.comment.length >= maxChars) {
            postComment.innerHTML = this.comment.slice(0, maxChars) + '...';
        } else {
            postComment.innerHTML = this.comment;
        }

        let gradeCount = clone.querySelector('#count');

        if (this.gradeCount == 1) {
            gradeCount.style.visibility = 'hidden';
        } else {
            gradeCount.style.visibility = 'visible';
        }

        gradeCount.innerHTML = (this.gradeCount - 1) + " Suggested Grades";  

        if (this.starRating >= 1) {
            let starOne = clone.querySelector("#star-one");
            starOne.classList.add('checked');
        } else {
            let starOne = clone.querySelector("#star-one");
            if (starOne.classList.contains('checked')) {
                starOne.classList.remove('checked');
            }
        }

        if (this.starRating >= 2) {
            let starTwo = clone.querySelector("#star-two");
            starTwo.classList.add('checked');
        } else {
            let starTwo = clone.querySelector("#star-two");
            if (starTwo.classList.contains('checked')) {
                starTwo.classList.remove('checked');
            }
        }

        if (this.starRating >= 3) {
            let starThree = clone.querySelector("#star-three");
                starThree.classList.add('checked');
        } else {
            let starThree = clone.querySelector("#star-three");
            if (starThree.classList.contains('checked')) {
                starThree.classList.remove('checked');
            }
        }

        if (this.starRating >= 4) {
            let starFour = clone.querySelector("#star-four");
                starFour.classList.add('checked');
        } else {
            let starFour = clone.querySelector("#star-four");
            if (starFour.classList.contains('checked')) {
                starFour.classList.remove('checked');
            }
        }

        if (this.starRating >= 5) {
            let starFive = clone.querySelector("#star-five");
                starFive.classList.add('checked');
        } else {
            let starFive = clone.querySelector("#star-five");
            if (starFive.classList.contains('checked')) {
                starFive.classList.remove('checked');
            }
        }

        let parent = document.getElementById('search-container').parentNode;
        parent.insertBefore(clone, null);
    }

    viewPost() {
        let element = document.getElementById('post-container');
        element.querySelector('#post-name').innerHTML = this.name;
        element.querySelector('#post-info').innerHTML = this.setterName + " - " + this.getPostTime();
        element.querySelector('#post-image').src = this.image;
        element.querySelector('#post-grade').innerHTML = this.getGrade();
        element.querySelector('#post-comment').innerHTML = this.comment;
        element.querySelector('#climb-type').innerHTML = this.climbType;
        if (this.gradeCount > 1) {
            element.querySelector('#grade-count').innerHTML = (this.gradeCount - 1) + " Grade Suggestions";  
        } else {
            element.querySelector('#grade-count').style.display = 'none';
        }

        if (this.starRating >= 1) {
            let starOne = element.querySelector("#star-one");
            starOne.classList.add('checked');
        } else {
            let starOne = element.querySelector("#star-one");
            if (starOne.classList.contains('checked')) {
                starOne.classList.remove('checked');
            }
        }

        if (this.starRating >= 2) {
            let starTwo = element.querySelector("#star-two");
            starTwo.classList.add('checked');
        } else {
            let starTwo = element.querySelector("#star-two");
            if (starTwo.classList.contains('checked')) {
                starTwo.classList.remove('checked');
            }
        }

        if (this.starRating >= 3) {
            let starThree = element.querySelector("#star-three");
                starThree.classList.add('checked');
        } else {
            let starThree = element.querySelector("#star-three");
            if (starThree.classList.contains('checked')) {
                starThree.classList.remove('checked');
            }
        }

        if (this.starRating >= 4) {
            let starFour = element.querySelector("#star-four");
                starFour.classList.add('checked');
        } else {
            let starFour = element.querySelector("#star-four");
            if (starFour.classList.contains('checked')) {
                starFour.classList.remove('checked');
            }
        }

        if (this.starRating >= 5) {
            let starFive = element.querySelector("#star-five");
                starFive.classList.add('checked');
        } else {
            let starFive = element.querySelector("#star-five");
            if (starFive.classList.contains('checked')) {
                starFive.classList.remove('checked');
            }
        }
    }

    toString() {
        return "Name: " + this.name + "\nGrade: " + this.grade + "\nStar Rating: " + this.starRating + "\nComment: " + this.comment;
    }
}

/*
const postConverter = {
    toFirestore: (post) => {
        return {
            setterName: post.getSetter(),
            name: post.getName(),
            image: post.getImage(),
            comment: post.getComment(),
            climbType: post.getClimbType(),
            grade: post.getGrade(),
            starRating: post.getStarRating(),
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Post(data.setterName, data.name, data.image, data.comment, data.climbType, data.grade, data.starRating);
    }
};*/