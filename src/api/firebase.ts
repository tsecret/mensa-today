import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

if (firebase.apps.length === 0){
    firebase.initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    })
}

const provider = new GoogleAuthProvider();
const auth = getAuth();

const getUser = () => auth.currentUser;

const addDocument = async (collection: string, data: any) => {
    return await firebase.firestore().collection(collection).add(data)
}

const setDocument = async (collection: string, id: string, data: any) => {
    return await firebase.firestore().collection(collection).doc(id).set(data)
}

const updateDocument = async (collection: string, id: string, data: any) => {
    return await firebase.firestore().collection(collection).doc(id).update(data)
}

const getDocument = async (collection: string, id: string) => {
    return await firebase.firestore().collection(collection).doc(id).get()
    .then((doc: any) => doc.data())
}

const onGoogleLogin = async () => {
    return await signInWithPopup(auth, provider)
    .then((result: any) => result)
    .catch((error) => { console.error("Googe login error: ", error)});
}

export default {
    getUser,
    addDocument,
    setDocument,
    updateDocument,
    getDocument,
    onGoogleLogin
}