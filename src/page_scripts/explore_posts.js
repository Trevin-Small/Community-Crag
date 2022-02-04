import { db, postCollectionName } from '../init.js';
import { CragDB } from '../library/crag_db.js';

export async function displayPosts(queryRef) {

    let postListContainer = document.getElementById('post-list');
    while (postListContainer.lastChild != null && postListContainer.lastChild.nodeName !== 'DIV') {
        postListContainer.removeChild(postListContainer.lastChild);
    }

    let postArray = await CragDB.getAllPosts(queryRef, db, postCollectionName, false);

    postArray.forEach((post) => {
        post.renderPostList('placeholder-post', post.getPostId());
    });

}

export async function searchByFilters(formId, e) {
    const form = new FormData(document.getElementById(formId));
    await displayPosts(CragDB.newQuery(db, postCollectionName, form.get('Grade'), form.get('Star Rating'), form.get('Climb Type')));
    document.getElementById('search-button').disabled = false;
}

export async function openPost(postId) {
    window.location.href = "https://communitycrag.com/viewpost?" + postId;
}