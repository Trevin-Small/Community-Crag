import { db, postCollectionName, CragDB } from '../library/library.js';

const postTemplateId = 'placeholder-post';

export async function displayPosts(queryRef, forceUpdate = false) {

    const postArray = await CragDB.getAllPosts(queryRef, db, postCollectionName, forceUpdate);

    const postListContainer = document.getElementById('post-list');
    const listChildren = Array.from(postListContainer.children);
    listChildren.forEach((child) => {
        if (child.nodeName === 'LI' || child.id === 'loading') {
            postListContainer.removeChild(child);
        }
    });

    const noResults = document.getElementById('no-results');
    if (postArray.length == 0) {
        noResults.style.display = 'flex';
        return;
    } else {
        noResults.style.display = 'none';
    }

    let postTimeArray = [];
    postArray.forEach((post) => {
        postTimeArray.push(post.getNumericPostTime());
    })

    quicksortByTime(postArray, postTimeArray);

    for (let i = postArray.length - 1; i >= 0; i--) {
        postArray[i].renderPostList(postTemplateId, postArray[i].getPostId());
    };

}

export async function searchByFilters(formId, forceUpdate = false) {
    const form = new FormData(document.getElementById(formId));
    await displayPosts(CragDB.newQuery(db, postCollectionName, form.get('Grade'), form.get('Star Rating'), form.get('Climb Type')), forceUpdate);
    document.getElementById('search-button').disabled = false;
}

export function openPost(postId, imageURL) {
    window.location.href = "./viewpost.html?id=" + postId;// + "&url=" + imageURL;
}

function swapArrayElements(postArray, postTimeArray, i, j) {
    let temp = postArray[i];
    postArray[i] = postArray[j];
    postArray[j] = temp;

    temp = postTimeArray[i];
    postTimeArray[i] = postTimeArray[j];
    postTimeArray[j] = temp;
}

function partition(postArray, postTimeArray, low, high) {
    let pivot = postTimeArray[high];
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
        if (postTimeArray[j] < pivot) {
            i++;
            swapArrayElements(postArray, postTimeArray, i, j);
        }
    }
    swapArrayElements(postArray, postTimeArray, i + 1, high);
    return (i + 1);
}

function quicksortByTime(postArray, postTimeArray, low = null, high = null) {
    if (low == null && high == null) {
        low = 0;
        high = postTimeArray.length - 1;
    }

    if (low < high) {
        let partitionIndex = partition(postArray, postTimeArray, low, high);
        quicksortByTime(postArray, postTimeArray, low, partitionIndex - 1);
        quicksortByTime(postArray, postTimeArray, partitionIndex + 1, high);

    }
}
