import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDn-3U3gTTwANRPVIsJ4_ZTQpBgiqS47NM",
  authDomain: "kaam-on-click.firebaseapp.com",
  databaseURL: "https://kaam-on-click-default-rtdb.firebaseio.com",
  projectId: "kaam-on-click",
  storageBucket: "kaam-on-click.firebasestorage.app",
  messagingSenderId: "125251261590",
  appId: "1:125251261590:web:f5d0dbdca2b6707902deb7"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();