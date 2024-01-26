import { IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

import { useState, useEffect } from 'react';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <ExploreContainer name="Tab 2 page" /> */}
        <IonItem>
          <IonInput label="Money spent" type="number"></IonInput>
        </IonItem>
        <IonItem>
          <IonInput label="Money made" type="number"></IonInput>
        </IonItem>
      </IonContent>

    </IonPage>
  );
};

export default Tab2;
