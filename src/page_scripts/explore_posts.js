import { newQuery, getAllPosts } from '../library/firestore_interface';
import { db, postCollectionName } from '../init.js';

export async function displayPosts(queryRef) {

    let postListContainer = document.getElementById('post-list');
    while (postListContainer.lastChild != null && postListContainer.lastChild.nodeName !== 'DIV') {
        postListContainer.removeChild(postListContainer.lastChild);
    }

    let postArray = await getAllPosts(queryRef, db, postCollectionName, false);

    postArray.forEach((post) => {
        post.renderPostList('placeholder-post', post.getPostId());
    });

}

export async function searchByFilters(formId, e) {
    const form = new FormData(document.getElementById(formId));
    await displayPosts(newQuery(db, postCollectionName, form.get('Grade'), form.get('Star Rating'), form.get('Climb Type')));
    document.getElementById('search-button').disabled = false;
}

export async function openPost(postId) {
    window.location.href = "https://communitycrag.com/viewpost?" + postId;
}