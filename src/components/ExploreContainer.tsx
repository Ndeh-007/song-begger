import React from 'react';
import {IonText} from "@ionic/react";

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container-center">
      <p>
          <IonText>{name}</IonText>
      </p>
    </div>
  );
};

export default ExploreContainer;
