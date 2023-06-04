import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCyGJpuGlrzMjV0kIaMht4673xiKN9gEgs",
    authDomain: "beggar-dc861.firebaseapp.com",
    projectId: "beggar-dc861",
    storageBucket: "beggar-dc861.appspot.com",
    messagingSenderId: "146917155340",
    databaseURL:"https://beggar-dc861-default-rtdb.firebaseio.com",
    appId: "1:146917155340:web:8db9ca5043d55b666c0429",
    measurementId: "G-G8ZZQQH572"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const database = getDatabase(app)
const analytics = getAnalytics(app)


export {firestore, database, analytics}