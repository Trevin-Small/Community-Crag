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
    const errorMessages = [
        "Name is over the character 20 limit!",
        "Comment is over the 1200 character limit!",
        "Image is not vertical!",
        "Field(s) cannot be left empty!",
        "You must upload an image!"
    ]

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
    const image = document.getElementById('file-upload').files;
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
    } else if (image.length == 0) {
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
        default:
            climbType = "Other";
            break;
    }

    document.getElementById('submit-new-climb').disabled = true;

    try {
        // Create a unique image name by appending the milliseconds since Jan 1, 1970, to the post name.
        const date = new Date();
        const postTime = date.getTime();

        let imageUrl = await CragDB.uploadCloudImage(imageStorageName, postTime, image);

        const uid = CacheDB.getUID();
        let setterName = CacheDB.getUsername();

        if (setterName == null) {
            setterName = await getUsername();
            CacheDB.setUserame(setterName);
        }

        // Create post object and push it to firestore
        const newPost = createNewPostObject(Math.floor(postTime / 10000), uid, setterName, name, imageUrl, comment, climbType, grade, starRating);
        await CragDB.addPost(db, postCollectionName, newPost);
        await CragDB.getAllPosts(null, db, postCollectionName, true);
        homeRedirect();

    } catch (e) {
        console.log("Error submiting post: " + e);
        document.getElementById('submit-new-climb').disabled = false;
    }
}

export function fileUploaded(value) {
    if (value != null) {
        document.getElementById('check').style.display = 'block';
        document.getElementById('camera').style.display = 'none';
    } else {
        document.getElementById('check').style.display = 'none';
        document.getElementById('camera').style.display = 'block';
    }
}