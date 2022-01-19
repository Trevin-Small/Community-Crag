import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDcpBJydcQt4vM-SAdnbRMI-GP0kPU_tn8",
    authDomain: "community-crag.firebaseapp.com",
    databaseURL: "https://community-crag-default-rtdb.firebaseio.com",
    projectId: "community-crag",
    storageBucket: "community-crag.appspot.com",
    messagingSenderId: "683436041104",
    appId: "1:683436041104:web:a8486a1b267488a5d2c915",
    measurementId: "G-LJPR80L555"
  };

initializeApp(firebaseConfig);

const db = getFirestore();

var postRef = collection(db, 'community-posts');


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
        var suggestionWeight = 1 / this.gradeCount;
        this.grade = ((this.gradeCount - 1) * suggestionWeight * this.grade) + (suggestionWeight * suggestedGrade);
    }

    suggestStarRating(suggestedRating) {
        this.starRatingCount++; 
        var suggestionWeight = 1 / this.starRatingCount;
        this.starRating = ((this.starRatingCount - 1) * suggestionWeight * this.starRating) + (suggestionWeight * suggestedRating);
    }

    async createPost(baseElementId) {
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
        pushPostToFireBase(this);
    }
}

async function pushPostToFireBase(post){
    try {
        const docRef = await setDoc(doc(db, 'community-posts', post.getName()), {
          name: post.getName(),
          grade: post.getGrade(),
          gradeCount: post.getGradeCount(),
          comment: post.getComment(),
          climbType: post.getClimbType(),
          starRating: post.getStarRating(),
          starRatingCount: post.getStarRatingCount(),
        });
    
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

window.onload = function() {
    for (let i = 0; i < 20; i++){
        let typeNum = Math.round(Math.random() * 4);
        let climbType = "empty";
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
        for (let j = 0; j < Math.random() * 3; j++) {
            post.suggestGrade(i + Math.random());
        }
        post.createPost('placeholder-post');
    }
}