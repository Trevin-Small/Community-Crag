import { doc, getDoc } from 'firebase/firestore';
import { db } from './index';
import { Post } from './post';

export async function viewPost() {
    const postId = window.location.href.split("?")[1].replace(/%20/g, " ");
    const docRef = doc(db, 'community-posts', postId);
    const postDoc = await getDoc(docRef);
    if (postDoc.exists()) {
        const postData = postDoc.data();
        let post = new Post(postData.postTime, postData.uid, postData.setterName, postData.name, postData.image, postData.comment, postData.climbType, postData.grade, postData.starRating);
        post.viewPost();
    } else {
        window.location.href = "https://communitycrag.com/postnotfound";
    }
}

const storage = getStorage();

export async function pushEditToFireBase(post){
    try {
        const docRef = await addDoc(postRef, {
            postTime: post.getNumericPostTime(),
            uid: post.getUID(),
            setterName: post.getSetterName(),
            name: post.getName(),
            image: post.getImage(),
            grade: post.getNumericalGrade(),
            gradeCount: post.getGradeCount(),
            comment: post.getComment(),
            climbType: post.getClimbType(),
            starRating: post.getStarRating(),
        });

    } catch (e) {
        console.error("Error adding document: ", e);
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

    const uid = getUID();
    const setterName = await getUsername();
    console.log("Username: " + setterName);
    // Create post object and push it to firestore
    const newPost = new Post(Math.floor(postTime / 10000), uid, setterName.toString(), name, imageUrl, comment, climbType, grade, starRating);
    await pushPostToFireBase(newPost);
    homeRedirect();
}