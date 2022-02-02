import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { errorMessage, inputErrorBorderHighlight, resetBorders } from './errors.js';
import { postCollection, storage } from './index';
import { createNewPostObject, setPost } from './post.js';
import { getUsername, isValidUser } from './auth.js';
import { homeRedirect } from './sharedFunctions.js';
import { CacheDB } from './cache.js';

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

    const valid = await isValidUser();
    if (valid == -1) {
        errorMessage("Something went wrong with your credentials. Please log out, close and reopen the tab, and log back in.", errorId);
        return;
    } else if (valid == 0) {
        errorMessage("You cannot post until your email is verified.", errorId);
        return;
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

    document.getElementById('submit-new-climb').disabled = true;

    try {
        // Create a unique image name by appending the milliseconds since Jan 1, 1970, to the post name.
        const date = new Date();
        const postTime = date.getTime();
        const storageRef = ref(storage, 'purdue/' + postTime);
        let imageUrl = null;

        // Upload image to firebase storage
        await uploadBytes(storageRef, image[0]);

        // Get the url of the image
        await getDownloadURL(storageRef).then((url) => {
            imageUrl = url;
        });

        const uid = CacheDB.getUID();
        const setterName = await getUsername();
        console.log("Username: " + setterName);
        // Create post object and push it to firestore
        const newPost = createNewPostObject(Math.floor(postTime / 10000), uid, setterName.toString(), name, imageUrl, comment, climbType, grade, starRating);
        await setPost(postCollection, newPost, true);
        CacheDB.cachePost(newPost);
        homeRedirect();
    } catch {
        document.getElementById('submit-new-climb').disabled = false;
    }
}
