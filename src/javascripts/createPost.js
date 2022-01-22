import { addDoc } from 'firebase/firestore';
import { errorMessage, inputErrorBorderHighlight, resetBorders } from './errors.js';
import { postRef } from './index';
import { Post } from './post.js';
import { getUsername } from './auth.js';

function homeRedirect() {
    const baseUrl = "https://communitycrag.com";
    window.location.href = baseUrl;
}

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

export function fileUploaded(value) {
    if (value != null) {
        document.getElementById('check').style.display='block';
        document.getElementById('camera').style.display='none';
    } else {
        document.getElementById('check').style.display='none';
        document.getElementById('camera').style.display='block';
    }
}

export function submitPost() {

    resetBorders(true, ['name', 'comment']);
    resetBorders(false, ['grade', 'star-rating', 'climb-type']);

    const errorId = 'error-message';
    const errorMessages = [
        "Name is over the character 20 limit.",
        "Comment is over the 1200 character limit.",
        "Image is not vertical.",
        "Field(s) cannot be left empty."
    ]

    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const grade = parseInt(document.getElementById('grade').value);
    const starRating = parseInt(document.getElementById('star-rating').value);
    let climbType = parseInt(document.getElementById('climb-type').value);

    // Invalid Input Handling
    if (name.length > 20 || name.length == 0 || /^\s*$/.test(name)) {
        inputErrorBorderHighlight('name');
        if (name.length > 20) {
            errorMessage(errorMessages[0], errorId);
        } else {
            errorMessage(errorMessages[3], errorId);
        }
        return;
    } else if (grade == -1) {
        inputErrorBorderHighlight('grade');
        errorMessage(errorMessages[3], errorId);
        return;
    } else if (starRating == 0) {
        inputErrorBorderHighlight('star-rating');
        errorMessage(errorMessages[3], errorId);
        return;
    } else if (parseInt(document.getElementById('climb-type').value) == 0) {
        inputErrorBorderHighlight('climb-type');
        errorMessage(errorMessages[3], errorId);
        return;
    } else if (comment.length > 1200 || comment.length == 0 || /^\s*$/.test(comment)) {
        inputErrorBorderHighlight('comment');
        if (comment.length > 1200) {
            errorMessage(errorMessages[1], errorId);
        } else {
            errorMessage(errorMessages[3], errorId);
        }
        return;
    }

    switch (climbType) {
        case 1:
            climbType = "Overhang";
            break;
        case 2:
            climbType = "Slab";
            break;
        case 3:
            climbType = "Mixed";
            break;
        case 4:
            climbType = "Vertical";
            break;
        default:
            climbType = "Other";
            break;
    }

    // Push link to google cloud storage
    // let image = Get image link
    const newPost = new Post(getUsername(), name, image, comment, climbType, grade, starRating);
    pushPostToFireBase(newPost);
    homeRedirect();
}
