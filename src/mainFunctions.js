import { doc, addDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, postRef } from './index';
import { Post, postConverter } from './post';

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

function queryPosts(grade, starRating, climbType) {

    grade = parseInt(grade);
    grade = grade == -1 ? null : parseInt(grade);
    starRating = parseInt(starRating);
    starRating = starRating == 0 ? null : starRating;

    if (climbType == 1) {
        climbType = "Overhang";
    } else if (climbType == 2) {
        climbType = "Slab";
    } else if (climbType == 3) {
        climbType = "Mixed";
    } else if (climbType == 4) {
        climbType = "Vertical";
    } else if (climbType == 5) {
        climbType = "Other";
    } else {
        climbType = null;
    }

    // If searching for V10, include all climbs V10+
    let gradeSearchRange = 1;
    if (grade == 10) { 
        gradeSearchRange = 10;
    }

    // All possible Query Combinations
    if (grade != null && starRating != null && climbType != null) {

        return query(postRef, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("starRating", "==", starRating), where("climbType", "==", climbType));

    } else if (grade != null && starRating != null) {

        return query(postRef, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("starRating", "==", starRating));

    } else if (grade != null && climbType != null) {

        return query(postRef, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange), where("climbType", "==", climbType));

    } else if (starRating != null && climbType != null) {

        return query(postRef, where("starRating", "==", starRating), where("climbType", "==", climbType));

    } else if (grade != null) {

        return query(postRef, where("grade", ">=", grade), where("grade", "<", grade + gradeSearchRange));
        
    } else if (climbType != null) {

        return query(postRef, where("climbType", "==", climbType));
        
    } else if (starRating != null) {

        return query(postRef, where("starRating", "==", starRating));
        
    } else {

        return null;

    }
}

export async function displayPosts(queryRef) {

    if (queryRef == null) {
        queryRef = postRef;
    }

    let postList = document.getElementById('post-list');
    if (postList.lastChild != null) {
        while (postList.lastChild && postList.lastChild.nodeName.localeCompare('DIV') == 1) {
            if (postList.lastChild.nodeName.localeCompare('SPAN') == 0) {
                continue;
            } else {
                postList.removeChild(postList.lastChild);
            }
        }
    }

    let dbPosts = await getDocs(queryRef);

    dbPosts.forEach((doc) => {
        const data = doc.data();
        let post = new Post(data.name, data.grade, data.comment, data.starRating, data.climbType);
        post.renderPostList('placeholder-post', doc.id);
    });
}

export function searchByFilters(formId, e) {
    e.preventDefault();
    const form = new FormData(document.getElementById(formId));
    displayPosts(queryPosts(form.get('Grade'), form.get('Star Rating'), form.get('Climb Type')));
}

export async function openPost(postId) {
    window.location.href = "https://communitycrag.com/viewpost?" + postId;
}

export async function viewPost() {
    const postId = window.location.href.split("?")[1].replace(/%20/g, " ");
    const docRef = doc(db, 'community-posts', postId);
    const postDoc = await getDoc(docRef);
    const postData = postDoc.data();
    let post = new Post(postData.name, postData.grade, postData.comment, postData.starRating, postData.climbType);
    post.viewPost();
}