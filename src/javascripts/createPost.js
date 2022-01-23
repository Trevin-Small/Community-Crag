import { addDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { errorMessage, inputErrorBorderHighlight, resetBorders } from './errors.js';
import { postRef } from './index';
import { Post } from './post.js';
import { getUsername } from './auth.js';
import { homeRedirect } from './sharedFunctions.js';

const storage = getStorage();

export async function pushPostToFireBase(post){
    try {
        const docRef = await addDoc(postRef, {
            name: post.getName(),
            image: post.getImage(),
            grade: post.getNumericalGrade(),
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

export async function submitPost() {

    const errorId = 'error-message';
    const errorMessages = [
        "Name is over the character 20 limit!",
        "Comment is over the 1200 character limit!",
        "Image is not vertical!",
        "Field(s) cannot be left empty!",
        "You must upload an image!"
    ]

    const metadata = {
        contentType: 'image/jpeg',
    }

    resetBorders(['#777', '3px'], ['name', 'comment']);
    resetBorders(['#777', '1px'], ['grade', 'star-rating', 'climb-type']);
    resetBorders(['black', '3px'], ['submit-new-climb']);

    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const image = document.getElementById('file-upload').files;
    const grade = parseInt(document.getElementById('grade').value);
    const starRating = parseInt(document.getElementById('star-rating').value);
    let climbType = parseInt(document.getElementById('climb-type').value);

    // Invalid Input Handling
    if (name.length > 20 || name.length == 0 || /^\s*$/.test(name)) {
        inputErrorBorderHighlight('name');
        inputErrorBorderHighlight('submit-new-climb');
        if (name.length > 20) {
            errorMessage(errorMessages[0], errorId);
        } else {
            errorMessage(errorMessages[3], errorId);
        }
        return;
    } else if (image.length == 0) {
        inputErrorBorderHighlight('submit-new-climb');
        errorMessage(errorMessages[4], errorId);
        return;
    } else if (grade == -1) {
        inputErrorBorderHighlight('grade');
        inputErrorBorderHighlight('submit-new-climb');
        errorMessage(errorMessages[3], errorId);
        return;
    } else if (starRating == 0) {
        inputErrorBorderHighlight('star-rating');
        inputErrorBorderHighlight('submit-new-climb');
        errorMessage(errorMessages[3], errorId);
        return;
    } else if (parseInt(document.getElementById('climb-type').value) == 0) {
        inputErrorBorderHighlight('climb-type');
        inputErrorBorderHighlight('submit-new-climb');
        errorMessage(errorMessages[3], errorId);
        return;
    } else if (comment.length > 1200 || comment.length == 0 || /^\s*$/.test(comment)) {
        inputErrorBorderHighlight('comment');
        inputErrorBorderHighlight('submit-new-climb');
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

    // Create a unique image name by appending the milliseconds since Jan 1, 1970, to the post name.
    const date = new Date();
    const imageName = date.getTime();
    const storageRef = ref(storage, 'purdue/' + imageName);
    let imageUrl = null;

    // Upload image to firebase storage
    await uploadBytes(storageRef, image[0]);

    // Get the url of the image
    await getDownloadURL(storageRef).then((url) => {
        imageUrl = url;
    });

    console.log("Username: " + getUsername());
    // Create post object and push it to firestore
    const newPost = new Post(getUsername(), name, imageUrl, comment, climbType, grade, starRating);
    await pushPostToFireBase(newPost);
    homeRedirect();
}
