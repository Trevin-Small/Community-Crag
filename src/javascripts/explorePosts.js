import { getDocs, query, where } from 'firebase/firestore';
import { postRef } from './index';
import { Post } from './post';

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
    while (postList.lastChild != null && postList.lastChild.nodeName !== 'DIV') {
        postList.removeChild(postList.lastChild);
    }

    let dbPosts = await getDocs(queryRef);

    dbPosts.forEach((doc) => {
        const data = doc.data();
        let post = new Post(data.name, "https://firebasestorage.googleapis.com/v0/b/community-crag.appspot.com/o/purdue%2Fwall.JPG?alt=media&token=07df40fe-d358-401e-b524-7efa3d56bd9d", data.comment, data.climbType, data.grade, data.starRating,);
        post.renderPostList('placeholder-post', doc.id);
    });
    let spacer = document.createElement('span');
    spacer.style.marginBottom = '12vh';
    let parent = document.getElementById('search-container').parentNode;
    parent.insertBefore(spacer, null);

}

export function searchByFilters(formId, e) {
    e.preventDefault();
    const form = new FormData(document.getElementById(formId));
    displayPosts(queryPosts(form.get('Grade'), form.get('Star Rating'), form.get('Climb Type')));
}

export async function openPost(postId) {
    window.location.href = "https://communitycrag.com/viewpost?" + postId;
}

