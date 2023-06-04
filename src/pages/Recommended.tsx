import React, {useEffect, useState} from 'react';
import {
    IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonImg, IonItem, IonLabel, IonList, IonListHeader,
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
            const arr:ISong[] = [...newSongs as ISong[], ...Songs]
            setSongs(arr)
            setLoading(false)
        })
    }, [])
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Recommended</IonTitle>
                </IonToolbar>
                {Loading && <IonProgressBar type={"indeterminate"}></IonProgressBar>}
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Recommended</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonGrid className={"ion-no-padding"}>
                    <IonRow className={"ion-align-items-center ion-justify-content-center"}>
                        <IonCol sizeXs={"12"} sizeSm={"12"} sizeMd="8">
                            <div className={"ion-padding-vertical"}>
                                <IonList>
                                    <IonListHeader>Listed From Most recent </IonListHeader>
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
                                                        <IonItem lines={"full"} key={index}>
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
                                </IonList>
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


