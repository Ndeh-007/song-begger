import React, {useEffect} from 'react';
import {  IonButton,
    IonCard, IonCardContent,
    IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol,
    IonContent, IonGrid,
    IonHeader, IonInput,
    IonPage, IonRow, IonTextarea,
    IonTitle,
    IonToolbar, useIonToast
} from '@ionic/react';
import * as EmailJS from "@emailjs/browser"
import {closeSharp, } from "ionicons/icons";

const Contact: React.FC = () => {
    const [Toast] = useIonToast()

    async function handleFormSubmission(e: React.FormEvent<HTMLFormElement>) {
        const email = e.currentTarget.email.value
        const message = e.currentTarget.message.value
        const username = e.currentTarget.username.value

        function showToast(color: string, message: string) {
            Toast({
                color,
                duration: 2500,
                message,
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

        EmailJS.send("song_begger_mail_service", "song_beggar_contact", {email, username, message}).then((res) => {
            showToast("light", "Operation Successful, " + res.text)
        }, (error) => {
            showToast("danger", "Operation Failed \n " + error.text)
        }).catch(err => {
            showToast("danger", "Operation Failed")
            console.log(err)
        })
    }

    function init() {
        EmailJS.init("xhgni5tAASWOcxiAS")
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <IonPage>
            <IonHeader >
                <IonToolbar>
                    <IonTitle>Contact</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color={"light"} fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Contact</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonGrid>
                    <IonRow className={"ion-align-items-center ion-justify-content-center"}>
                        <IonCol sizeXs={"12"} sizeSm={"12"} sizeMd="8">

                            <IonCard>
                                <IonGrid className={"ion-no-padding"}>
                                    <IonRow>
                                        <IonCol size={"12"}>
                                            {/*<IonImg  src={LocalImages.me}></IonImg>*/}
                                            <IonCardContent className={"ion-no-padding"}>
                                                <IonGrid className={"ion-no-padding"}>
                                                    <IonRow>
                                                        {/*<IonCol sizeSm={"12"} sizeXs={"12"} sizeMd={"2"}>*/}
                                                        {/*    <IonImg src={LocalImages.me}></IonImg>*/}
                                                        {/*</IonCol>*/}
                                                        <IonCol sizeSm={"12"} sizeXs={"12"} sizeMd={"8"}>
                                                            <IonCardHeader>
                                                                <IonCardTitle>Song Beggar</IonCardTitle>
                                                                <IonCardSubtitle>Ndeh, A.</IonCardSubtitle>
                                                            </IonCardHeader>
                                                            <div className={"ion-text-start"}>
                                                                <p className={"ion-padding-start"}>
                                                                    Song Beggar, as the name suggest is what i use to
                                                                    beg for song recommendations from people who are
                                                                    in my contacts. Primarily Whatsapp. Since not every
                                                                    body may want to slide into the others DM
                                                                    because it is too much wahala.
                                                                </p>

                                                                <p className={"ion-padding"}>
                                                                    The search bar can filter between using youtube and
                                                                    spotify in case
                                                                    your forgot
                                                                    the
                                                                    title of
                                                                    the song you wanted to recommend. You could also
                                                                    view songs
                                                                    recommended by other
                                                                    people.
                                                                </p>

                                                                <p className={"ion-padding-start"}>
                                                                    Thanks for recommending something for me to listen
                                                                    to. Yours truly,
                                                                    a humble
                                                                    beggar🥺🙏🏿🤲🏿.
                                                                </p>


                                                                <p className={"ion-padding"}>
                                                                    If you have query (which i do not think you will
                                                                    have), message me
                                                                </p>
                                                            </div>
                                                        </IonCol>
                                                    </IonRow>
                                                </IonGrid>
                                            </IonCardContent>
                                            <IonCardHeader>
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault()
                                                        handleFormSubmission(e).then(()=>{
                                                            return
                                                        }).catch((e) => {
                                                            console.log(e);
                                                            window.alert(e)
                                                        })
                                                    }}
                                                    className={"ion-text-start ion-padding-top"}
                                                >
                                                    <div className={"ion-padding-horizontal "}>
                                                        <IonInput fill={"outline"} labelPlacement={"floating"}
                                                                  placeholder={"abc@email.com"}
                                                                  label={"Email"}
                                                                  required
                                                                  name={"email"} type={"email"}
                                                        ></IonInput>
                                                        <div className={'ion-padding-top'}></div>
                                                        <IonInput fill={"outline"} labelPlacement={"floating"}
                                                                  label={"Name"}
                                                                  required
                                                                  name={"username"} type={"text"}
                                                        ></IonInput>
                                                        <div className={'ion-padding-top'}></div>
                                                        <IonTextarea fill={"outline"} labelPlacement={"floating"}
                                                                     label={"Message"}
                                                                     placeholder={"Message..."}
                                                                     required name={"message"}></IonTextarea>
                                                    </div>

                                                    <div className={"ion-padding ion-text-center"}>
                                                        <IonButton type={'submit'}>Send</IonButton>
                                                    </div>
                                                </form>
                                            </IonCardHeader>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>

            </IonContent>
        </IonPage>
    );
};

export default Contact;
