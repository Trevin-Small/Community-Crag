import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '../init';

export async function uploadCloudImage(directoryName, postTime, image) {
    const storageRef = ref(storage, directoryName + postTime);
    // Upload image to firebase storage
    await uploadBytes(storageRef, image[0]);
    return await getCloudImage(storageRef);
}

export async function getCloudImage(storageRef) {
    let imageUrl = null;
    // Get the url of the image
    await getDownloadURL(storageRef).then((url) => {
        imageUrl = url;
    });
    return imageUrl;
}

export async function deleteCloudImage(url) {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
}