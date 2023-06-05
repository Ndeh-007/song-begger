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
    IonToolbar
} from "@ionic/react";
import {LocalImages} from "../images/Images";
import {close, musicalNotes, pause, play} from "ionicons/icons";
import {Simulate} from "react-dom/test-utils";
import ReactAudioPlayer from "react-audio-player";
import {useGlobalStateContext} from "../Global";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'

const PlayerBar: React.FC = () => {
    const playerRef = useRef<AudioPlayer>(null)
    const progressBar = useRef<HTMLIonProgressBarElement>(null)
    const GLOBAL_OPTIONS = useGlobalStateContext()
    const [PlaySong, setPlaySong] = useState(false)
    const [SongDetailsModal, setSongDetailsModal] = useState(false)
    const [progress, setProgress] = useState(0);

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
        if (!playerRef.current)
            return

        if (playerRef.current.isPlaying())
            return;

        playerRef?.current.audio.current?.play().catch((e) => {
            console.log(e)
        })
    }

    function pauseSong() {
        setPlaySong(false)
        if (playerRef.current)
            playerRef?.current.audio.current?.pause()
    }

    function initializePlayer() {
        setProgress(1)
        try {
            playSong()
        } catch (e) {
            console.log(e)
        }
    }

    function openSongDetailsModal() {
        setSongDetailsModal(true)
    }

    useEffect(() => {
        initializePlayer()
        // monitorProgress()
    }, [GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.song])

    return (
        GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.state ? <IonFooter>
            <IonToolbar color={"transparent"}>
                <div>
                    <IonCard className={"ion-no-padding ion-no-margin"} color={"light"}>
                        <AudioPlayer style={{display: "none"}}
                                     src={GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.song?.previewLink}
                                     ref={playerRef}
                                     onError={(e) => {
                                         console.log(e)
                                     }}
                        ></AudioPlayer>
                        <IonToolbar color={"transparent"} className={"ion-no-padding"} onClick={() => {
                            openSongDetailsModal()
                        }}>
                            <IonThumbnail style={{
                                "--border-radius": "10px",
                                marginLeft: "5px",
                            }} className={""} slot={"start"}>
                                <IonImg src={GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.song?.image}></IonImg>
                            </IonThumbnail>
                            <div>
                                <div>
                                    <IonTitle
                                        className={"ion-padding-horizontal"}> {GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.song?.title} </IonTitle>
                                </div>
                                <div style={{paddingTop: "3px", fontSize: "x-small"}}>
                                    <IonText
                                        color={"medium"}
                                        className={"ion-padding-horizontal"}>
                                        {GLOBAL_OPTIONS.GlobalState.PLAYER_CONTROLS.song?.artist}  </IonText>
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