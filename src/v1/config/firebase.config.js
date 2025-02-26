import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuU8f8M3TBvz3dK2CRCLXQkgiyuB6Yirw",
    authDomain: "tippaydigital.firebaseapp.com",
    projectId: "tippaydigital",
    storageBucket: "tippaydigital.appspot.com",
    messagingSenderId: "16775412936",
    appId: "1:16775412936:android:1c8504a665cc907982f9fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };