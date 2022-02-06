import { db, postCollectionName, CragDB } from '../library/library.js';


export async function displayPosts(queryRef) {

    let postListContainer = document.getElementById('post-list');
    while (postListContainer.lastChild != null && postListContainer.lastChild.nodeName !== 'DIV') {
        postListContainer.removeChild(postListContainer.lastChild);
    }

    let postArray = await CragDB.getAllPosts(queryRef, db, postCollectionName, false);

    const noResults = document.getElementById('no-results');
    if (postArray.length == 0) {
        noResults.style.display = 'flex';
    } else {
        noResults.style.display = 'none';
    }

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
    window.location.href = "./viewpost.html?" + postId;
}