import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import pushNumber from '../components/firebasePull'; 
import './Tab2.css';

const Tab2: React.FC = () => {
  const [numberInput, setNumberInput] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const number = parseFloat(numberInput);
    if (!isNaN(number)) {
        await pushNumber(number);
        setNumberInput('');
    }
};

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
        <ExploreContainer name="Tab 2 page" />

        {/* Form for submitting a number */}
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonInput 
              type="text" // keep this as "text" to properly handle float inputs
              value={numberInput} 
              placeholder="Enter a number" 
              onIonChange={e => setNumberInput(e.detail.value!)} 
              
            />
          </IonItem>
          <IonButton expand="block" type="submit">Submit Number</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
