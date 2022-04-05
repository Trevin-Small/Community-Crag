import {
    createNewPostObject,
    getUsername,
    isValidUser,
    db,
    imageStorageName,
    postCollectionName,
    homeRedirect,
    CragDB,
    CacheDB,
    Errors
} from '../library/library.js'

export async function submitPost() {

    const errorId = 'error-message';
    const infoId = 'info-message';
    const errorMessages = [
        "Name is over the character 20 limit!",
        "Comment is over the 1200 character limit!",
        "Image is not vertical!",
        "Field(s) cannot be left empty!",
        "You must upload an image!"
    ]

    // Hide info and error messages so that old ones don't continue to display..
    Errors.errorMessage(null, errorId);
    Errors.infoMessage(null, infoId);

    const valid = await isValidUser();
    if (valid == -1) {
        Errors.errorMessage("Something went wrong with your credentials. Please log out, close and reopen the tab, and log back in.", errorId);
        return;
    } else if (valid == 0) {
        Errors.errorMessage("You cannot post until your email is verified.", errorId);
        return;
    }

    Errors.resetBorders(['#777', '3px'], ['name', 'comment']);
    Errors.resetBorders(['#777', '1px'], ['grade', 'star-rating', 'climb-type']);
    Errors.resetBorders(['black', '3px'], ['submit-new-climb']);

    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const image = document.getElementById('file-upload').files[0];
    const grade = parseInt(document.getElementById('grade').value);
    const starRating = parseInt(document.getElementById('star-rating').value);
    let climbType = parseInt(document.getElementById('climb-type').value);

    // Invalid Input Handling
    if (name.length > 20 || name.length == 0 || /^\s*$/.test(name)) {
        Errors.inputErrorBorderHighlight('name');
        Errors.inputErrorBorderHighlight('submit-new-climb');
        if (name.length > 20) {
            Errors.errorMessage(errorMessages[0], errorId);
        } else {
            Errors.errorMessage(errorMessages[3], errorId);
        }
        return;
    } else if (image == null || image == undefined) {
        Errors.inputErrorBorderHighlight('submit-new-climb');
        Errors.errorMessage(errorMessages[4], errorId);
        return;
    } else if (grade == -1) {
        Errors.inputErrorBorderHighlight('grade');
        Errors.inputErrorBorderHighlight('submit-new-climb');
        Errors.errorMessage(errorMessages[3], errorId);
        return;
    } else if (starRating == 0) {
        Errors.inputErrorBorderHighlight('star-rating');
        Errors.inputErrorBorderHighlight('submit-new-climb');
        Errors.errorMessage(errorMessages[3], errorId);
        return;
    } else if (parseInt(document.getElementById('climb-type').value) == 0) {
        Errors.inputErrorBorderHighlight('climb-type');
        Errors.inputErrorBorderHighlight('submit-new-climb');
        Errors.errorMessage(errorMessages[3], errorId);
        return;
    } else if (comment.length > 1200 || comment.length == 0 || /^\s*$/.test(comment)) {
        Errors.inputErrorBorderHighlight('comment');
        Errors.inputErrorBorderHighlight('submit-new-climb');
        if (comment.length > 1200) {
            Errors.errorMessage(errorMessages[1], errorId);
        } else {
            Errors.errorMessage(errorMessages[3], errorId);
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
        case 5:
            climbType = "Dyno";
            break;
        default:
            climbType = "Other";
            break;
    }

    const submitButton = document.getElementById('submit-new-climb');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Loading...';
    Errors.infoMessage("Submission Loading...", infoId);

    try {
        // Create a unique image name by appending the milliseconds since Jan 1, 1970, to the post name.
        const date = new Date();
        const postTime = date.getTime();
        const firebasePostTime = Math.floor(postTime / 10000);
        const uid = CacheDB.getUID();
        const imageData = await CragDB.uploadCloudImage(imageStorageName, postTime, uid, image);
        const imageURL = imageData[0];
        const aspectRatio = imageData[1];

        let setterName = CacheDB.getUsername();
        if (setterName == null) {
            setterName = await getUsername();
            CacheDB.setUserame(setterName);
        }

        // Create post object and push it to firestore
        const newPost = createNewPostObject(firebasePostTime, uid, setterName, name, imageURL, aspectRatio, comment, climbType, grade, starRating);
        await CragDB.addPost(db, postCollectionName, newPost);

        // Query by post time to get the most recent post
        await CragDB.getAllPosts(null, db, postCollectionName, true);
        homeRedirect();

    } catch (e) {
        Errors.infoMessage(null, infoId);
        Errors.errorMessage("An internal error occured. Try again later...", errorId);
        console.log("Error submitting post: " + e);
        document.getElementById('submit-new-climb').disabled = false;
    }
}

export function fileUploaded(fileUploadId) {
    let image = null;

    try {
        image = document.getElementById(fileUploadId).files[0];
    } catch (e) {
        console.log(e);
    }

    if (image != null) {
        document.getElementById('check').style.display = 'block';
        document.getElementById('camera').style.display = 'none';
    } else {
        document.getElementById('check').style.display = 'none';
        document.getElementById('camera').style.display = 'block';
    }
    displayImagePreview(image);
}

async function displayImagePreview(image) {
    const imageData = await CragDB.loadImageFile(image);
    const imageSRC = imageData[1];

    const imagePreview = document.getElementById('image-preview');
    imagePreview.src = imageSRC;

    const imagePreviewContainer = document.getElementById('image-preview-container');
    imagePreviewContainer.style.display = 'flex';

}