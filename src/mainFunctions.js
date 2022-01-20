import { doc, setDoc, addDoc, getDoc, getDocs } from 'firebase/firestore';
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
/*
export function queryPosts(name, grade, starRating, climbType) {

    let gradeSearchRange = 1;

    // If searching for V10, include all climbs V10+
    if (grade == 10) { 
        gradeSearchRange = 10;
    }

    if (name != null && grade != null && starRating != null && climbType != null) {
        return query(postRef, where("name", "==", name), where("grade", ">=", grade), where("grade", "<=", grade + gradeSearchRange), where("starRating", "==", starRating), where("climbType", "==", climbType));
    } else if (name != null && grade != null && starRating != null) {
        return query(postRef, where("name", "==", name), where("grade", ">=", grade), where("grade", "<=", grade + gradeSearchRange), where("starRating", "==", starRating));
    } else if (name != null && grade != null) {
        return query(postRef, where("name", "==", name), where("grade", ">=", grade), where("grade", "<=", grade + gradeSearchRange));
    } else {
        return query(postRef, where("name", "==", name));
    }
}
*/
export async function displayPosts() {

    let postList = document.getElementById('post-list');
    if (postList.lastChild != null) {
        while (postList.lastChild) {
            postList.removeChild(postList.lastChild);
        }
    }

    let dbPosts = await getDocs(postRef);

    dbPosts.forEach((doc) => {
        let data = doc.data();
        let post = new Post(data.name, data.grade, data.comment, data.starRating, data.climbType);
        post.renderPost('placeholder-post', doc.id);
    });
}