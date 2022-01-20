import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { postRef } from './index';
import { Post } from './post';

export async function pushPostToFireBase(post){
    try {
        const docRef = await addDoc(postRef, {
            name: post.getName(),
            grade: post.getGrade(),
            gradeCount: post.getGradeCount(),
            comment: post.getComment(),
            climbType: post.getClimbType(),
            starRating: post.getStarRating(),
            starRatingCount: post.getStarRatingCount(),
            merge: true
        });

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function displayPosts(queryRef) {

    if (queryRef == null) {
        queryRef = postRef;
    }

    let postList = document.getElementById('post-list');
    if (postList.lastChild != null) {
        while (postList.lastChild) {
            postList.removeChild(postList.lastChild);
        }
    }

    let dbPosts = await getDocs(queryRef);

    dbPosts.forEach((doc) => {
        let data = doc.data();
        let post = new Post(data.name, data.grade, data.comment, data.starRating, data.climbType);
        post.renderPost('placeholder-post', doc.id);
    });
}

export function queryPosts(grade, starRating, climbType) {

    grade = parseInt(grade) === -1 ? null : parseInt(grade);
    starRating = parseInt(starRating) === 0 ? null : parseInt(starRating);
    climbType = parseInt(climbType) === 0 ? null : climbType;

    let gradeSearchRange = 1;

    // If searching for V10, include all climbs V10+
    if (grade == 10) { 
        gradeSearchRange = 10;
    }

    if (grade != null && starRating != null && climbType != null) {
        return query(postRef, where("grade", ">=", grade), where("grade", "<=", grade + gradeSearchRange), where("starRating", "==", starRating), where("climbType", "==", climbType));
    } else if (grade != null && starRating != null) {
        return query(postRef, where("grade", ">=", grade), where("grade", "<=", grade + gradeSearchRange), where("starRating", "==", starRating));
    } else if (grade != null) {
        return query(postRef, where("grade", ">=", grade), where("grade", "<=", grade + gradeSearchRange));
    } else {
        return getDocs(postRef);
    }
}

export function searchByFilters(formId, e) {
    e.preventDefault();
    let form = new FormData(document.getElementById(formId));
    displayPosts(queryPosts(form.get('Grade'), form.get('Star Rating'), form.get('Climb Type')));
}