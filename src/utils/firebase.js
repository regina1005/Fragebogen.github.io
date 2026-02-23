import { initializeApp } from 'firebase/app';
import { getDatabase, ref, runTransaction, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBIqN2D_dZNb2p1xsFWYi96lfMm5UGaamE",
    authDomain: "sockenstudie-a3b70.firebaseapp.com",
    databaseURL: "https://sockenstudie-a3b70-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sockenstudie-a3b70",
    storageBucket: "sockenstudie-a3b70.firebasestorage.app",
    messagingSenderId: "635872092825",
    appId: "1:635872092825:web:400af1119ad9c8cdcece08"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Keep track of what a user has liked in localStorage so they can only like 1 image max
const LOCAL_STORAGE_KEY = 'sockenstudie_liked_image';

export function getLikedImage() {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function hasLiked() {
    return !!getLikedImage();
}

/**
 * Likes or unlikes an image in the database. Only one like per user is allowed.
 * @param {string} imageId The unique string identifier for the image (e.g. filename)
 * @param {boolean} isUnlike Set to true if this should revoke the existing like
 * @returns {Promise<boolean>} Resolves to true if successful
 */
export async function likeImage(imageId, isUnlike = false) {
    if (hasLiked() && !isUnlike) return false;
    if (!hasLiked() && isUnlike) return false;

    const imgRef = ref(database, 'likes/' + imageId.replace(/\./g, '_'));

    try {
        await runTransaction(imgRef, (currentLikes) => {
            const current = currentLikes || 0;
            if (isUnlike) {
                return Math.max(0, current - 1);
            }
            return current + 1;
        });

        if (isUnlike) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY, imageId);
        }
        return true;
    } catch (e) {
        console.error("Like failed", e);
        return false;
    }
}

/**
 * Subscribe to realtime updates for all likes
 * @param {Function} callback Function called with { imageId: likeCount }
 */
export function subscribeToLikes(callback) {
    const likesRef = ref(database, 'likes');
    return onValue(likesRef, (snapshot) => {
        callback(snapshot.val() || {});
    });
}
