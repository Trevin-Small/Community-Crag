/*!
* Start Bootstrap - Bare v5.0.7 (https://startbootstrap.com/template/bare)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
class Post {
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
        var suggestionWeight = 1 / this.gradeCount;
        this.grade = ((this.gradeCount - 1) * suggestionWeight * this.grade) + (suggestionWeight * suggestedGrade);
    }

    suggestStarRating(suggestedRating) {
        this.starRatingCount++; 
        var suggestionWeight = 1 / this.starRatingCount;
        this.starRating = ((this.starRatingCount - 1) * suggestionWeight * this.starRating) + (suggestionWeight * suggestedRating);
    }

    createPost(baseElementId) {
        let element = document.getElementById(baseElementId);
        let clone = element.cloneNode(true);
        let postName = document.getElementById('post-name');
        postName.innerHTML = this.name;
        let postGrade = document.getElementById('post-grade');
        postGrade.innerHTML = this.getGrade();
        let postComment = document.getElementById('post-comment');
        postComment.innerHTML = this.comment;
        let climbType = document.getElementById('climb-type');
        climbType.innerHTML = this.climbType;
        let gradeCount = document.getElementById('count');
        gradeCount.innerHTML = this.gradeCount + " Suggested Grades";  

        if (this.starRating >= 1) {
            let starOne = document.getElementById("star-one");
            if (!starOne.classList.contains('checked')) {
                starOne.classList.add('checked');
            }
        } else {
            let starOne = document.getElementById("star-one");
            if (starOne.classList.contains('checked')) {
                starOne.classList.remove('checked');
            }
        }

        if (this.starRating >= 2) {
            let starTwo = document.getElementById("star-two");
            if (!starTwo.classList.contains('checked')) {
                starTwo.classList.add('checked');
            }
        } else {
            let starTwo = document.getElementById("star-two");
            if (starTwo.classList.contains('checked')) {
                starTwo.classList.remove('checked');
            }
        }

        if (this.starRating == 3) {
            let starThree = document.getElementById("star-three");
            if (!starThree.classList.contains('checked')) {
                starThree.classList.add('checked');
            }
        } else {
            let starThree = document.getElementById("star-three");
            if (starThree.classList.contains('checked')) {
                starThree.classList.remove('checked');
            }
        }
         
        element.before(clone);
    }
}

window.onload = function() {
    for (let i = 0; i < 20; i++){
        let typeNum = Math.round(Math.random() * 4);
        switch(typeNum){
            case 1:
                climbType = "Slab";
                break;
            case 2:
                climbType = "Overhang";
                break;
            case 3:
                climbType = "Mixed";
                break;
            default:
                climbType = "Other";
                break;          
        }
        let post = new Post("Some Climb", i + Math.random(), "Haha noob", Math.round(Math.random() * 3), climbType);
        for (let j = 0; j < Math.random() * 10; j++) {
            post.suggestGrade(i + Math.random());
        }
        post.createPost('placeholder-post');
    }
}