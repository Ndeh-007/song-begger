import {collection, doc, setDoc, onSnapshot} from "firebase/firestore";
import {firestore, database} from "../Firebase";
import { ref, onValue} from "firebase/database";
import {ISong} from "../Interface";

export async function getRecommendationsFromFirestore(): Promise<ISong[]> {
    return new Promise((resolve) => {
        const colRef = collection(firestore, "recommendations")
        onSnapshot(colRef, (snap) => {
            const docs = snap.docs.map(doc => doc.data())
            resolve(docs as never)
        })
    })
}

export async function addRecommendationsToFirestore(data: ISong): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const colRef = collection(firestore, "recommendations")
        setDoc(doc(colRef, data.id), data).then(() => {
            resolve(true)
        }).catch(e => reject(e))
    })
}

export async function ListenForRecommendationsFromRealTimeDatabase():Promise<ISong[]>{
    return new Promise((resolve)=>{
        const recRef = ref(database, "recommendations")
        onValue(recRef, (snapshot)=>{
            const arr:ISong[] = []
            snapshot.forEach(child => {
                arr.push(child.val())
            })
            resolve(arr)
        })
    })
}