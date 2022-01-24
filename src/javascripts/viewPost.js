import { doc, getDoc } from 'firebase/firestore';
import { db } from './index';
import { Post } from './post';

export async function viewPost() {
    const postId = window.location.href.split("?")[1].replace(/%20/g, " ");
    const docRef = doc(db, 'community-posts', postId);
    const postDoc = await getDoc(docRef);
    const postData = postDoc.data();
    let post = new Post(postData.setterName, postData.name, postData.image, postData.comment, postData.climbType, postData.grade, postData.starRating);
    post.viewPost();
}
