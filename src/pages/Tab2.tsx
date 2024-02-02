import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import pushNumber from '../components/firebasePull'; 
import './Tab2.css';
import { fetchBalances} from '../components/firebasePull';


const Tab2: React.FC = () => {
  const [numberInput, setNumberInput] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('deposit'); // State to track transaction type

  const [numbers, setNumbers] = useState<number[]>([]);
  useEffect(() => {

    const fetchAndSetNumbers = async () => {
      const fetchedNumbers = await fetchBalances();
      setNumbers(fetchedNumbers);   
    };  
    fetchAndSetNumbers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const number = parseFloat(numberInput);

    // Check transaction type and number validity
    if (transactionType === 'deposit' && number >= 0) {
      await pushNumber(number);
      setNumberInput('');
    } else if (transactionType === 'withdraw' && number < 0) {
      await pushNumber(number );
      setNumberInput('');
    }else if(transactionType === 'withdraw' && number > 0) {
      await pushNumber(number *-1);
      setNumberInput('');
      } else {
      alert('Please enter a valid number for the selected transaction type.');
    }
};

  let status = Boolean;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <>
          <IonSegment value={transactionType} onIonChange={e => setTransactionType(String(e.detail.value))}>
            <IonSegmentButton value="deposit">
              <IonLabel>Deposit</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="withdraw">
              <IonLabel>Withdraw</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </>
        {/* Other content, if any */}
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonInput 
              type="text" 
              value={numberInput} 
              placeholder="Enter a number" 
              onIonChange={e => setNumberInput(e.detail.value!)} 
            />
          </IonItem>
          <IonButton expand="block" type="submit">Submit Number</IonButton>
        </form>
        <>
        <ul>
          {numbers.map((number, index) => (
            <li key={index}>{number}</li>
            
          ))}
        </ul>

    </>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
