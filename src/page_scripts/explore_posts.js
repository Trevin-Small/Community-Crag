import { db, postCollectionName, CragDB } from '../library/library.js';

const postTemplateId = 'placeholder-post';

export async function displayPosts(queryRef) {

    let postArray = await CragDB.getAllPosts(queryRef, db, postCollectionName, false);

    const postListContainer = document.getElementById('post-list');
    const listChildren = Array.from(postListContainer.children);
    listChildren.forEach((child) => {
        if (child.nodeName === 'LI' || child.id === 'loading') {
            console.log("Removing: " + child.id + "\n");
            postListContainer.removeChild(child);
        }
    });

    const noResults = document.getElementById('no-results');
    if (postArray.length == 0) {
        noResults.style.display = 'flex';
    } else {
        noResults.style.display = 'none';
    }

    postArray.forEach((post) => {
        post.renderPostList(postTemplateId, post.getPostId());
    });

}

export async function searchByFilters(formId) {
    const form = new FormData(document.getElementById(formId));
    await displayPosts(CragDB.newQuery(db, postCollectionName, form.get('Grade'), form.get('Star Rating'), form.get('Climb Type')));
    document.getElementById('search-button').disabled = false;
}

export function openPost(postId, imageURL) {
    window.location.href = "./viewpost.html?id=" + postId;// + "&url=" + imageURL;
}