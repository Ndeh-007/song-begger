import React, {useEffect, useRef, useState} from "react";
import {
    IonButton,
    IonButtons, IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle, IonFooter, IonIcon,
    IonImg,
    IonItem, IonLabel,
    IonNote, IonProgressBar, IonText,
    IonThumbnail, IonTitle,
    IonToolbar, useIonToast
} from "@ionic/react";
import {close, closeSharp, pause, play,} from "ionicons/icons";
import {useGlobalStateContext} from "../Global";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'
import {ISong} from "../Interface";

const PlayerBar: React.FC = () => {
    const playerRef = useRef<AudioPlayer>(null)
    const playButton = useRef<HTMLIonButtonElement>(null)
    const progressBar = useRef<HTMLIonProgressBarElement>(null)
    const GLOBAL_OPTIONS = useGlobalStateContext()
    const [PlaySong, setPlaySong] = useState(false)
    const [Song, setSong] = useState<ISong>()
    const [SongDetailsModal, setSongDetailsModal] = useState(false)
    const [progress, setProgress] = useState(0);
    const [Toast] = useIonToast()


    function showAlert(message: string, position: "top" | "middle" | "bottom" = "top", header = "Just so you know...") {
        Toast({
            color: "light",
            message,
            header,
            position: position,
            buttons: [
                {
                    role: 'cancel',
                    icon: closeSharp,
                    handler: () => {
                        return
                    },
                }
            ],
        }).then(() => {
            localStorage.setItem("heads-up", "true")
        }).catch(e => console.log(e))
    }

    function closePlayer() {
        GLOBAL_OPTIONS.dispatch({
            payload: {
                state: false,
            },
            dataType: "player"
        })
    }

    function togglePlayButton() {
        setPlaySong(!PlaySong)
    }

    function playSong() {
        setPlaySong(true)
        playerRef?.current!.audio.current?.play().catch((e) => {
            console.log(e)
        })
    }

    function pauseSong() {
        setPlaySong(false)
        if (playerRef.current)
            playerRef?.current.audio.current?.pause()
    }

    function showHeadsUp() {
        const state = localStorage.getItem("heads-up")
        if (state === "true") {
            return
        }

        showAlert("The playback is just 30s of part of the song. Recommended pieces carry links to the song." +
            "Most will be on spotify. For some reason, the audio is overlapped, like 2 of the same song playing from one speaker. " +
            "Maybe it is my browser.(Devs, come and troubleshoot me🥺🙏🏿).", "middle", "Quick Heads Up")
    }

    function openSongDetailsModal() {
        setSongDetailsModal(true)
    }

    useEffect(() => {

        showHeadsUp()
        setProgress(1)
        setSong(GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.song)
        // setPlaySong(true)
        // monitorProgress()
    }, [GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.song])

    useEffect(()=>{
        pauseSong()
        playSong()
    },[Song])

    return (
        GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.state ? <IonFooter>
            <IonToolbar color={"transparent"}>
                <div>
                    <IonCard className={"ion-no-padding ion-no-margin"} color={"light"}>
                        <AudioPlayer style={{display: "none"}}
                                     src={Song?.previewLink}
                                     ref={playerRef}
                                     autoPlay={true}
                                     autoPlayAfterSrcChange={true}
                                     onError={(e) => {
                                         console.log(e)
                                     }}
                                     onEnded={(e) => {
                                         setPlaySong(false)
                                     }}
                        ></AudioPlayer>
                        <IonToolbar color={"transparent"} className={"ion-no-padding"} onClick={() => {
                            openSongDetailsModal()
                        }}>
                            <IonThumbnail style={{
                                "--border-radius": "10px",
                                marginLeft: "5px",
                            }} className={""} slot={"start"}>
                                <IonImg src={Song?.image}></IonImg>
                            </IonThumbnail>
                            <div>
                                <div>
                                    <IonTitle
                                        className={"ion-padding-horizontal"}> {Song?.title} </IonTitle>
                                </div>
                                <div style={{paddingTop: "3px", fontSize: "x-small"}}>
                                    <IonText
                                        color={"medium"}
                                        className={"ion-padding-horizontal"}>
                                        {Song?.artist}  </IonText>
                                </div>
                            </div>
                            <IonButtons slot={'end'}>
                                <IonButton disabled>
                                    <IonLabel className={"ion-text-lowercase"}>30s</IonLabel>
                                </IonButton>
                                {/*{!PlaySong ? <IonButton color={"dark"} onClick={(e) => {*/}
                                {/*    playSong()*/}
                                {/*    e.stopPropagation()*/}
                                {/*}}>*/}
                                {/*    <IonIcon icon={play}></IonIcon>*/}
                                {/*</IonButton> : <IonButton color={"dark"} onClick={(e) => {*/}
                                {/*    pauseSong()*/}
                                {/*    e.stopPropagation()*/}
                                {/*}}>*/}
                                {/*    <IonIcon icon={pause}></IonIcon>*/}
                                {/*</IonButton>}*/}
                                <IonButton onClick={() => closePlayer()}>
                                    <IonIcon icon={close} slot={"icon-only"}></IonIcon>
                                </IonButton>

                            </IonButtons>
                        </IonToolbar>
                        <IonProgressBar value={progress} ref={progressBar} type={"determinate"}></IonProgressBar>
                    </IonCard>
                </div>
            </IonToolbar>
        </IonFooter> : <></>
    )
}

export default PlayerBar