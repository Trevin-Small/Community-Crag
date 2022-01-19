import { doc, setDoc, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { postRef } from './index';
import { Post } from './post';

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
  
export async function displayPosts() {

    let postList = document.getElementById('post-list');
    let postListChildren = postList.children;
    while (postList.lastChild) {
      postList.removeChild(postList.lastChild);
    }

    let dbPosts = await getDocs(postRef);
    dbPosts.forEach((doc) => {
        let data = doc.data();
        let post = new Post(data.name, data.grade, data.comment, data.starRating, data.climbType);
        post.renderPost('placeholder-post', doc.id);
    });
  }