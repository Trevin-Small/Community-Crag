import { addDoc } from 'firebase/firestore';
import { postRef } from './index';

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