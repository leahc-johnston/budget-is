import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { sumAllBalances } from '../components/firebasePull'; // Adjust the import path as needed

const Tab1: React.FC = () => {
  const [totalSum, setTotalSum] = useState<number>(0);

  useEffect(() => {
    const calculateAndSetTotalSum = async () => {
      const sum = await sumAllBalances();
      setTotalSum(sum);
    };

    calculateAndSetTotalSum();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle> {/* If this is Tab1, consider renaming the title to "Tab 1" for consistency */}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle> {/* Same here regarding the title */}
          </IonToolbar>
        </IonHeader>
        
        {/* Display the total sum of balances */}
        <div>
          <h2>Total Sum of Balances:</h2>
          <p>{totalSum}</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
