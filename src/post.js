export class Post {
    constructor(name, grade, comment, starRating, climbType) {
        this.name = name;

        if (grade - Math.floor(grade) == 0) {
            this.grade = grade + 0.5;
        } else {
            this.grade = grade;
        }

        this.comment = comment;
        this.starRating = starRating;
        this.climbType = climbType;
        this.gradeCount = 1;
        this.starRatingCount = 1;
    }

    getName() {
        return this.name;
    }

    getGrade() {
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

    getStarRatingCount() {
        return this.starRatingCount;
    }

    getClimbType() {
        return this.climbType;
    }

    setName(name) {
        this.name = name;
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

    suggestGrade(suggestedGrade) {
        this.gradeCount++; 
        let suggestionWeight = 1 / this.gradeCount;
        this.grade = ((this.gradeCount - 1) * suggestionWeight * this.grade) + (suggestionWeight * suggestedGrade);
    }

    suggestStarRating(suggestedRating) {
        this.starRatingCount++; 
        let suggestionWeight = 1 / this.starRatingCount;
        this.starRating = ((this.starRatingCount - 1) * suggestionWeight * this.starRating) + (suggestionWeight * suggestedRating);
    }

    renderPostList(baseElementId, docId) {
        let element = document.getElementById(baseElementId);
        let clone = element.cloneNode(true);
        clone.id = docId;
        clone.querySelector('#post-container').setAttribute('id',docId);
        let postName = clone.querySelector('#post-name');
        let hiddenPostName = clone.querySelector('#hidden-post-name');
        postName.innerHTML = this.name;
        hiddenPostName.innerHTML = this.name;
        let postGrade = clone.querySelector('#post-grade');
        postGrade.innerHTML = this.getGrade();
        let postComment = clone.querySelector('#post-comment');

        const maxChars = (window.innerWidth / 700) * 75;
        if (this.comment.length >= maxChars) {
            postComment.innerHTML = this.comment.slice(0, maxChars) + '...';
        } else {
            postComment.innerHTML = this.comment;
        }

        let climbType = clone.querySelector('#climb-type');
        climbType.innerHTML = this.climbType;
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

        if (this.starRating == 3) {
            let starThree = clone.querySelector("#star-three");
                starThree.classList.add('checked');
        } else {
            let starThree = clone.querySelector("#star-three");
            if (starThree.classList.contains('checked')) {
                starThree.classList.remove('checked');
            }
        }
        document.getElementById('post-list').appendChild(clone);
    }

    viewPost() {
        let element = document.getElementById('post-container');
        let postName = element.querySelector('#post-name');
        postName.innerHTML = this.name;
        let postGrade = element.querySelector('#post-grade');
        postGrade.innerHTML = this.getGrade();
        let postComment = element.querySelector('#post-comment');
        postComment.innerHTML = this.comment;
        let climbType = element.querySelector('#climb-type');
        climbType.innerHTML = this.climbType;
        let gradeCount = element.querySelector('#count');

        gradeCount.innerHTML = (this.gradeCount - 1) + " Suggested Grades";  

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

        if (this.starRating == 3) {
            let starThree = element.querySelector("#star-three");
                starThree.classList.add('checked');
        } else {
            let starThree = element.querySelector("#star-three");
            if (starThree.classList.contains('checked')) {
                starThree.classList.remove('checked');
            }
        }
    }

    toString() {
        return "Name: " + this.name + "\nGrade: " + this.grade + "\nStar Rating: " + this.starRating + "\nComment: " + this.comment;
    }
}

const postConverter = {
    toFirestore: (post) => {
        return {
            name: post.getName(),
            comment: post.getComment(),
            grade: post.getGrade(),
            starRating: post.getStarRating(),
            climbType: post.getClimbType()
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Post(data.name, data.grade, data.comment, data.starRating, data.climbType);
    }
}