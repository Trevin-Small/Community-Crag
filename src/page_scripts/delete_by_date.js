import { db, postCollectionName, CragDB, CacheDB } from '../library/library.js';


export async function deletePostsByDate() {
    let dateString = document.getElementById('date').value;
    const date = new Date(dateString.slice(6), parseInt(dateString.substring(0,2)) - 1, dateString.substring(3, 5));
    const dateMilliseconds = Math.floor(date.getTime() / 10000);
    const posts = await CragDB.queryPosts(CragDB.newQuery(db, postCollectionName, null, null, null, dateMilliseconds));

    posts.forEach(function(post) {
        let postId = post.getPostId();
        CragDB.deletePost(db, postCollectionName, postId);
        console.log("Deleted Post: " + post.getName());
        CacheDB.removePost(postId);
    });
}