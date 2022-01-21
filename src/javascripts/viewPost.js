import { doc, getDoc } from 'firebase/firestore';
import { db } from './index';
import { Post } from './post';

export async function viewPost() {
    const postId = window.location.href.split("?")[1].replace(/%20/g, " ");
    const docRef = doc(db, 'community-posts', postId);
    const postDoc = await getDoc(docRef);
    const postData = postDoc.data();
    let post = new Post(postData.setter, postData.name, "https://firebasestorage.googleapis.com/v0/b/community-crag.appspot.com/o/purdue%2Fwall.JPG?alt=media&token=07df40fe-d358-401e-b524-7efa3d56bd9d", postData.comment, postData.climbType, postData.grade, postData.starRating);
    post.viewPost();
}
