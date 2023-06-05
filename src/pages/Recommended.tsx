import React, {useEffect, useRef, useState} from 'react';
import {
    IonBadge, IonButton, IonButtons,
    IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader,
    IonPage, IonPopover, IonProgressBar,
    IonRow, IonThumbnail,
    IonTitle,
    IonToolbar, useIonToast
} from '@ionic/react';
import {ISong} from "../Interface";
import ExploreContainer from "../components/ExploreContainer";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {firestore} from "../Firebase";
import {useGlobalStateContext} from "../Global";
import PlayerBar from "../components/PlayerBar";
import {arrowRedo, closeSharp, copy, ellipsisVertical, notifications} from "ionicons/icons";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {AudioPlayerProvider} from "react-use-audio-player";

const Recommended: React.FC = () => {
    const [Songs, setSongs] = useState<ISong[]>([])
    const [Song, setSong] = useState<ISong>()
    const [AddedSongs, setAddedSongs] = useState<ISong[]>([])
    const [Loading, setLoading] = useState(false)
    const GLOBAL_OPTIONS = useGlobalStateContext()
    const [popoverOpen, setPopoverOpen] = useState(false);
    const popover = useRef<HTMLIonPopoverElement>(null);
    const [Toast] = useIonToast()

    useEffect(() => {
        setLoading(true)

        const colRef = collection(firestore, "recommendations")
        const q = query(colRef, orderBy("date", "desc"))
        /**
         * Attach an event listener to update the list when ever some new song is added
         */
        onSnapshot(q, (snap) => {
            const changes = snap.docChanges()
            const newSongs = changes.map((change) => {
                if (change.type === "added") {
                    return change.doc.data()
                }
            })
            setAddedSongs(newSongs as ISong[])
            setLoading(false)
        })

    }, [])

    function playSelection(song: ISong) {
        GLOBAL_OPTIONS.dispatch({
            dataType: "player",
            payload: {
                song,
                state: true
            }
        })
    }

    useEffect(() => {
        const s = [...Songs]
        const a = [...AddedSongs]
        const n = [...a, ...s]
        setSongs(n)
    }, [AddedSongs])

    function showClickOptions(e: React.MouseEvent<HTMLIonButtonElement>, item: ISong) {
        popover.current!.event = e;
        setSong(item)
        setPopoverOpen(true);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Recommended</IonTitle>
                    <IonBadge slot={"end"} className={'ion-margin-end'}>{Songs.length}</IonBadge>
                </IonToolbar>
                {Loading && <IonProgressBar type={"indeterminate"}></IonProgressBar>}
            </IonHeader>
            <IonContent fullscreen color={"light"}>
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
                                                    <IonCol>
                                                        <IonItem color={"light"} lines={"inset"} key={index} button
                                                                 onClick={() => playSelection(item)}>
                                                            <IonThumbnail slot={"start"}>
                                                                <IonImg src={item.image}></IonImg>
                                                            </IonThumbnail>
                                                            <IonCardHeader>
                                                                <IonCardTitle>{item.title}</IonCardTitle>
                                                                <IonCardSubtitle>{item.artist}</IonCardSubtitle>
                                                            </IonCardHeader>
                                                            {
                                                                (item.spotifyLink || item.previewLink || item.href) ?
                                                                    <IonButtons slot={"end"}>
                                                                        <IonButton onClick={(e) => {
                                                                            showClickOptions(e, item)
                                                                            e.stopPropagation()
                                                                        }}>
                                                                            <IonIcon icon={ellipsisVertical}></IonIcon>
                                                                        </IonButton>
                                                                    </IonButtons> : <></>
                                                            }
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

                <IonPopover ref={popover} isOpen={popoverOpen} onDidDismiss={() => setPopoverOpen(false)}>
                    <IonContent>
                        <IonList>
                            <CopyToClipboard text={Song?.spotifyLink as string} onCopy={() => {
                                Toast({
                                    color: "light",
                                    position: 'top',
                                    message: "Link copied",
                                    icon: notifications,
                                    duration: 1500,
                                    buttons: [
                                        {
                                            role: 'cancel',
                                            icon: closeSharp,
                                            handler: () => {
                                                return
                                            },
                                        }
                                    ],
                                }).then()
                            }}>
                                <IonItem lines={"inset"} button onClick={() => setPopoverOpen(false)}>
                                    <IonIcon slot={"start"} icon={copy}></IonIcon>
                                    <IonLabel>Copy link</IonLabel>
                                </IonItem>
                            </CopyToClipboard>
                            <IonItem lines={"inset"} button href={Song?.spotifyLink}
                                     onClick={() => setPopoverOpen(false)}>
                                <IonIcon slot={"start"} icon={arrowRedo}></IonIcon>
                                <IonLabel>Follow</IonLabel>
                            </IonItem>
                        </IonList>
                    </IonContent>
                </IonPopover>
                {
                    Songs.length == 0 && <ExploreContainer name={"No Songs"}/>
                }
            </IonContent> {GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.state &&
             <PlayerBar/> }

        </IonPage>
    );
};

export default Recommended;


