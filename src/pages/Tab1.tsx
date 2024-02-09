import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { sumAllBalances, sumWithdrawl, sumDeposit } from '../components/firebasePull'; // Adjust the import path as needed
import { pushTotals, pushPositives, pushNegatives, pushAllTotals } from '../components/firebasePush'; // Adjust the import path as needed

const Tab1: React.FC = () => {
  const [totalSum, setTotalSum] = useState<number>(0);
  const [totalNeg, setTotalNeg] = useState<number>(0);
  const [totalPos, setTotalPos] = useState<number>(0);

  useEffect(() => {
    const calculateAndSetTotalSum = async () => {
      const sum = await sumAllBalances();
      setTotalSum(sum);
    };

    calculateAndSetTotalSum();
  }, []);

  useEffect(() => {
    const calculateAndSetWithdrawl = async () => {
      const sumNeg = await sumWithdrawl();
      setTotalNeg(sumNeg);
    };

    calculateAndSetWithdrawl();
  }, []);

  useEffect(() => {
    const calculateAndSetDeposit = async () => {
      const sumPos = await sumDeposit();
      setTotalPos(sumPos);
    };

    calculateAndSetDeposit();
  }, []);





  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large">Tab 1</IonTitle>
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
          <p>Total Deposits {totalPos}</p>
          <p>Total Withdrawl {totalNeg}</p>
          <p>Total Sum {totalSum}</p>
       </div>
       <IonButton onClick={() => pushAllTotals(totalSum, totalPos, totalNeg)}>SUBMIT DAILY TOTALS</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
