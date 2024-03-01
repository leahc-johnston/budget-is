import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { sumAllBalances, sumWithdrawl, sumDeposit } from '../components/firebasePull';
import { pushTotals, pushPositives, pushNegatives, pushAllTotals } from '../components/firebasePush';
import { useUser } from '../components/context'; // Ensure this path is correctly pointing to where your context is defined

const Tab1: React.FC = () => {
  const [totalSum, setTotalSum] = useState<number>(0);
  const [totalNeg, setTotalNeg] = useState<number>(0);
  const [totalPos, setTotalPos] = useState<number>(0);
  const { userId } = useUser(); // Correctly using userId

  

  useEffect(() => {
    console.log('Current User ID:', userId); // Correctly log userId

    // Ensure this function is called only if userId is available
    if (userId) {
        const calculateAndSetTotalSum = async () => {
            const sum = await sumAllBalances(userId); // Now passing userId as argument
            setTotalSum(sum);
        };
        calculateAndSetTotalSum();
    }
}, [userId]); // Add userId as a dependency to re-run this effect when userId changes

  useEffect(() => {
    const calculateAndSetWithdrawl = async () => {
      const sumNeg = await sumWithdrawl(); // Pass userId as argument
      setTotalNeg(sumNeg);
    };

    calculateAndSetWithdrawl();
  }, [userId]); // Use userId as a dependency

  useEffect(() => {
    const calculateAndSetDeposit = async () => {
      const sumPos = await sumDeposit(); // Pass userId as argument
      setTotalPos(sumPos);
    };

    calculateAndSetDeposit();
  }, [userId]); // Use userId as a dependency





  return (
    <IonPage >
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
          <h2 className='work'>Total Sum of Balances:</h2>
          <p className='beans'>Total Deposits </p>
          <p className='one'>{totalPos}</p>
          <p className='beans'>Total Withdrawl</p>
          <p className='one'>{totalNeg}</p>
          <p className='beans'>Total Sum </p>
          <p className='one'>{totalSum}</p>
       </div>
       <IonButton className='total' onClick={() => pushAllTotals(totalSum, totalPos, totalNeg)}>SUBMIT DAILY TOTALS</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
