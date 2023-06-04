import React, {useEffect, useRef, useState} from 'react';
import {
    IonActionSheet,
    IonButton,
    IonButtons,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCheckbox,
    IonCol,
    IonContent,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonProgressBar,
    IonRow,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonThumbnail,
    IonTitle,
    IonToolbar,
    useIonToast
} from '@ionic/react';
import {
    arrowBack,
    arrowForward,
    close,
    closeSharp,
    notifications,
    options,
} from "ionicons/icons";
import {ISong} from "../Interface";
import ExploreContainer from "../components/ExploreContainer";
import {addRecommendationsToFirestore, ListenForRecommendationsFromRealTimeDatabase} from "../api/manageData";
import axios from "axios";
import {LocalImages} from "../images/Images";

const Home: React.FC = () => {
    const [modifyModal, setModifyModal] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [targetAPI, setTargetAPI] = useState<"YouTube" | "Spotify">("Spotify")
    const [SearchIcon, setSearchIcon] = useState(LocalImages.spotify)
    const selectItemRef = useRef<HTMLIonItemElement>(null)
    const searchBarRef = useRef<HTMLIonSearchbarElement>(null)
    const [searchResults, setSearchResults] = useState<ISong[]>([])
    const [selectedSongs, setSelectedSongs] = useState<ISong[]>([])
    const [Toast] = useIonToast()

    async function init() {
        const data = await ListenForRecommendationsFromRealTimeDatabase()
        setSearchResults(data)
        return
    }

    function removeItemFromSelected(index: number) {
        const arr = [...selectedSongs]
        arr.splice(index, 1)
        setSelectedSongs(arr)
    }

    function resetSelection() {
        // setSelectedSongs([])
        setModifyModal(false)
    }

    function showAppreciation() {
        Toast({
            color: "light",
            duration: 4000,
            message: "Thank you very much for this. Do well to recommend some more for this poor soul 😊😘",
            icon: notifications,
            header: "Success",
            position: "top",
            buttons: [
                {
                    role: 'cancel',
                    icon: closeSharp,
                    handler: () => {
                        return
                    },
                }
            ],
        }).catch(e => console.log(e))
        setLoading(false)
    }

    function showAlert(message: string) {
        Toast({
            color: "light",
            message,
            header: "Just so you know...",
            position: "top",
            buttons: [
                {
                    role: 'cancel',
                    icon: closeSharp,
                    handler: () => {
                        return
                    },
                }
            ],
        }).catch(e => console.log(e))
    }
    async function saveRecommendations() {
        setLoading(true)
        for (const song of selectedSongs) {
            await addRecommendationsToFirestore(song)
        }
    }

    async function handleSearch(value: string | undefined | null) {
        setLoading(true)
        if (value == undefined) {
            return
        }
        if (value == '') {
            return
        }
        const res = await axios.post("https://song-begger-server-production.up.railway.app/", {keywords: value, api: targetAPI.toLocaleLowerCase()});
        const songs = res.data as ISong[]
        if (Array.isArray(songs)) {
            setSearchResults(songs)
        }
    }

    function handleCheckState(item: ISong, checked: boolean) {
        const arr = [...selectedSongs]
        if (checked) {
            arr.push(item)
            setSelectedSongs(arr)
        } else {
            // remove the item from the list
            const newArr = arr.filter(song => song.id != item.id)
            setSelectedSongs(newArr)
        }
    }
    useEffect(() => {
        // requestBrowserNotificationPermission()
        init().then(() => {
            setLoading(false)
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, [])


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Search</IonTitle>

                    <IonButtons slot={"end"}>
                        <IonButton id="open-action-sheet">
                            <IonIcon slot={"icon-only"} icon={options}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>


                <IonToolbar color='transparent'
                >
                    <IonGrid className={"ion-no-padding"} style={{
                        backgroundColor:"var(--ion-toolbar-background)"
                    }}>
                        <IonRow className={"ion-justify-content-between"}>
                            <IonCol size={"12"}>
                                <IonToolbar>
                                    <IonSearchbar
                                        searchIcon={SearchIcon}
                                        style={{"--box-shadow":"none"}} color={"light"} ref={searchBarRef} placeholder={`What song are you looking for?`}
                                                  onKeyPress={(e) => {
                                                      if (e.key == "Enter") {
                                                          const value = searchBarRef?.current?.value
                                                          handleSearch(value).then(() => setLoading(false)).catch(e => {
                                                              console.log(e)
                                                              setLoading(false)
                                                          })
                                                      }
                                                  }}></IonSearchbar>
                                </IonToolbar>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
                {Loading && <IonProgressBar type={"indeterminate"}></IonProgressBar>}
            </IonHeader>
            <IonContent fullscreen  color={"light"}>

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Find Song</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonActionSheet
                    trigger="open-action-sheet"
                    header="Search With"
                    buttons={[
                        {
                            text: 'YouTube',
                            handler: () => {
                                setTargetAPI("YouTube");
                                setSearchIcon(LocalImages.youtube)
                                showAlert("Hehe, filtering by youtube doesn't work. The api/code was more than me 😅😅. Searching will still work, using spotify instead.")

                            }
                        },
                        {
                            text: 'Spotify',
                            handler: () => {
                                setTargetAPI("Spotify")
                                setSearchIcon(LocalImages.spotify)
                            }
                        },
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            data: {
                                action: 'cancel',
                            },
                        },
                    ]}
                ></IonActionSheet>

                <IonItem style={{display: "none"}} ref={selectItemRef}>
                    <IonSelect onIonChange={e => {
                        const name = e.detail.value
                        setTargetAPI(name)
                    }}>
                        <IonSelectOption value={"YouTube"}>YouTube</IonSelectOption>
                        <IonSelectOption value={"Spotify"}>Spotify</IonSelectOption>
                    </IonSelect>
                </IonItem>
                {/*<div className={"ion-padding-top"}></div>*/}
                <IonGrid className={"ion-no-padding"}>
                    <IonRow className={"ion-align-items-center ion-justify-content-center"}>
                        <IonCol sizeXs={"12"} sizeSm={"12"} sizeMd="8">
                            <div>
                                <div >
                                    {
                                        searchResults.map((item, index) => {
                                            return (
                                                <IonItem color={"light"} lines={"full"} key={index}>
                                                    <IonThumbnail slot={"start"}>
                                                        <IonImg src={item.image}></IonImg>
                                                    </IonThumbnail>
                                                    <IonCardHeader>
                                                        <IonCardTitle>{item.title}</IonCardTitle>
                                                        <IonCardSubtitle>{item.artist}</IonCardSubtitle>
                                                    </IonCardHeader>
                                                    <IonCheckbox slot={'end'}
                                                                 onIonChange={(e) => handleCheckState(item, e.detail.checked)}></IonCheckbox>
                                                </IonItem>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {
                    searchResults.length == 0 && <ExploreContainer name={"No Results"}/>
                }
            </IonContent>
            {
                selectedSongs.length > 0 && (
                    <IonFooter>
                        <IonToolbar>
                            <IonLabel className={"ion-padding-start"} slot={"start"} >
                                Selected Songs ({selectedSongs.length})
                              </IonLabel>
                            <IonButton slot={"end"} fill={"clear"} className={"ion-margin-end"} shape={"round"}
                                       onClick={() => setModifyModal(true)}
                            >
                                <IonIcon slot={"icon-only"} icon={arrowForward}></IonIcon>
                            </IonButton>
                        </IonToolbar>
                    </IonFooter>
                )
            }

            <IonModal isOpen={modifyModal}
                      onDidDismiss={() => setModifyModal(false)}
            >
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot={"start"}>
                            <IonButton onClick={() => setModifyModal(false)}>
                                <IonIcon slot={"icon-only"} icon={arrowBack}></IonIcon>
                            </IonButton>
                        </IonButtons>
                        <IonTitle>Preview Selection</IonTitle>
                    </IonToolbar>
                    {Loading && <IonProgressBar type={"indeterminate"}></IonProgressBar>}
                </IonHeader>
                <IonContent fullscreen color={"light"}>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">Preview Selection</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonGrid className={"ion-no-padding"}>
                        <IonRow className={"ion-align-items-center ion-justify-content-center"}>
                            <IonCol sizeXs={"12"} sizeSm={"12"} sizeMd="8">
                                <div className={"ion-padding-vertical"}>
                                    <div>
                                        {
                                            selectedSongs.map((item, index) => {
                                                return (
                                                    <IonRow key={index} className={"ion-align-items-center"}>
                                                        <IonCol size={"1"}>
                                                            <div className={"ion-text-center"}>
                                                                <IonLabel>{index + 1}</IonLabel>
                                                            </div>
                                                        </IonCol>
                                                        <IonCol>
                                                            <IonItem color={"light"} lines={"inset"} key={index}>
                                                                <IonThumbnail slot={"start"}>
                                                                    <IonImg src={item.image}></IonImg>
                                                                </IonThumbnail>
                                                                <IonCardHeader>
                                                                    <IonCardTitle>{item.title}</IonCardTitle>
                                                                    <IonCardSubtitle>{item.artist}</IonCardSubtitle>
                                                                </IonCardHeader>
                                                                <IonButtons slot={"end"}>
                                                                    <IonButton
                                                                        onClick={() => removeItemFromSelected(index)}>
                                                                        <IonIcon icon={close}
                                                                                 slot={"icon-only"}></IonIcon>
                                                                    </IonButton>
                                                                </IonButtons>
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
                </IonContent>

                <IonFooter>
                    <IonToolbar color={'transparent'}>
                        <IonButton shape={"round"}  expand={"block"} onClick={() => {
                            saveRecommendations().then(() => {
                                resetSelection()
                                showAppreciation();
                                // notifyMe(`${selectedSongs.length} have been recommended. Click to view 💃`)
                            }).catch(e => {
                                // showError()
                                console.log(e)
                            })
                        }}
                                   className={"ion-margin-horizontal"}>Recommend - ({selectedSongs.length})</IonButton>
                    </IonToolbar>
                </IonFooter>
            </IonModal>
        </IonPage>
    );
};

export default Home;
