import { db, postCollectionName, CragDB } from '../library/library.js';


export async function deletePostsByDate(dateString) {
    const date = new Date("Date milliseconds: " + dateString);
    const dateMilliseconds = Math.floor(date.getTime() / 10000);
    const posts = await CragDB.queryPosts(CragDB.newQuery(null, null, null, dateMilliseconds));

    posts.forEach(function(post) {
        CragDB.deletePost(db, postCollectionName, postId);
        CacheDB.removePost(post.getPostId());
        console.log("Deleted Post: " + post.getName());
    });
}