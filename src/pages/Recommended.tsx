import React, {useEffect, useState} from 'react';
import {
    IonBadge,
    IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonImg, IonItem, IonLabel, IonListHeader,
    IonPage, IonProgressBar,
    IonRow, IonThumbnail,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {ISong} from "../Interface";
import ExploreContainer from "../components/ExploreContainer";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {firestore} from "../Firebase";

const Recommended: React.FC = () => {
    const [Songs, setSongs] = useState<ISong[]>([])
    const [AddedSongs, setAddedSongs] = useState<ISong[]>([])
    const [Loading, setLoading] = useState(false)


    useEffect(() => {
        setLoading(true)

        const colRef = collection(firestore, "recommendations")
        const q = query(colRef, orderBy("date", "desc"))
        /**
         * Attach an event listener to update the list when ever some new song is added
         */
        onSnapshot(q, (snap) => {
            const changes = snap.docChanges()
            const newSongs = changes.map((change)=>{
                if (change.type === "added"){
                    return change.doc.data()
                }
            })
            setAddedSongs(newSongs as ISong[])
            setLoading(false)
        })

    }, [])

    useEffect(()=>{
        const s = [...Songs]
        const a = [...AddedSongs]
        const n = [...a,...s]
        setSongs(n)
    },[AddedSongs])
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Recommended</IonTitle>
                    <IonBadge slot={"end"} className={'ion-margin-end'}>{Songs.length}</IonBadge>
                </IonToolbar>
                {Loading && <IonProgressBar type={"indeterminate"}></IonProgressBar>}
            </IonHeader>
            <IonContent fullscreen  color={"light"} >
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Recommended</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonGrid className={"ion-no-padding"}>
                    <IonRow className={"ion-align-items-center ion-justify-content-center"}>
                        <IonCol sizeXs={"12"} sizeSm={"12"} sizeMd="8">
                            <div>
                                <div>
                                    <IonListHeader>Most recent first. </IonListHeader>
                                    {
                                        Songs.map((item, index) => {
                                            return (
                                                <IonRow key={index} className={"ion-align-items-center"}>
                                                    <IonCol size={"1"}>
                                                        <div className={"ion-text-center"}>
                                                            <IonLabel>{index + 1}</IonLabel>
                                                        </div>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonItem  color={"light"}  lines={"inset"} key={index}>
                                                            <IonThumbnail slot={"start"}>
                                                                <IonImg src={item.image}></IonImg>
                                                            </IonThumbnail>
                                                            <IonCardHeader>
                                                                <IonCardTitle>{item.title}</IonCardTitle>
                                                                <IonCardSubtitle>{item.artist}</IonCardSubtitle>
                                                            </IonCardHeader>
                                                        </IonItem>
                                                    </IonCol>
                                                </IonRow>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {
                    Songs.length == 0 && <ExploreContainer name={"No Songs"}/>
                }
            </IonContent>
        </IonPage>
    );
};

export default Recommended;


