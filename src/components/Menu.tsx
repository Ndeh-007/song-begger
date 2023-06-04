import {
    IonContent,
    IonList,
    IonMenu,
} from '@ionic/react';

import React from "react";

const Menu: React.FC = () => {

    return (
        <IonMenu side={"end"} type="overlay">
            <IonContent>
                <IonList id="inbox-list-one">
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
