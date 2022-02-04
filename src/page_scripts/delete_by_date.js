import { queryPosts, newQuery, deletePost } from '../library/firestore_interface.js';
import { db, postCollectionName } from '../init.js';

export async function deletePostsByDate(dateString) {
    const date = new Date("Date milliseconds: " + dateString);
    const dateMilliseconds = Math.floor(date.getTime() / 10000);
    const posts = await queryPosts(newQuery(null, null, null, dateMilliseconds));

    posts.forEach((post) => {
        deletePost(db, postCollectionName, postId);
        CacheDB.removePost(post.getPostId());
        console.log("Deleted Post: " + post.getName());
    });
}