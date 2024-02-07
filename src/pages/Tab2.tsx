import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import { fetchBalances, updateBalance, pushNumber } from '../components/firebasePull';
import './Tab2.css';

const Tab2: React.FC = () => {
    const [numberInput, setNumberInput] = useState<string>(''); //for managing transaction input
    const [transactionType, setTransactionType] = useState<string>('deposit'); //for tracking transaction type
    const [editId, setEditId] = useState<string | null>(null); //for identifying transaction being edited
    const [editValue, setEditValue] = useState<string>(''); //for value being edited
    const [numbers, setNumbers] = useState<{ id: string, balance: number }[]>([]); // for storing transactions to database


    //hook to fetch transactions
    useEffect(() => {
        const fetchAndSetNumbers = async () => {
            const fetchedNumbers = await fetchBalances();
            setNumbers(fetchedNumbers);
        };
        fetchAndSetNumbers();
        
    }, []);

    //initiate editing of transactions
    const startEditing = (id: string, balance: number) => {
        setEditId(id);
        setEditValue(balance.toString());
    };

    //save edit to database
    const saveEdit = async (id: string) => {
        const updatedNumber = parseFloat(editValue);
        if (!isNaN(updatedNumber)) {
            await updateBalance(id, updatedNumber);
            setEditId(null);
            setEditValue('');
            fetchAndSetNumbers(); // Refresh the data - currently not working
            
        }
        
    };

    //form submission for adding or updating transactions
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const number = parseFloat(numberInput);

      //logic to handle deposit or withdraw
      if (transactionType === 'deposit' || (transactionType === 'withdraw' && number <= 0 || number >=0)) { // Ensure correct logic for transaction type and number
          if (editId) {
            //updating exisiting transaction if editing
              await updateBalance(editId, transactionType === 'withdraw' ? -Math.abs(number) : number);
          } else {
            // add new transacation if not editing
              await pushNumber({ balance: transactionType === 'withdraw' ? -Math.abs(number) : number });
          }
          //resets fields after submission
          setNumberInput('');
          setEditId(null);
      } else {
          alert('Please enter a valid number for the selected transaction type.');
      }
      window.location.reload();
  };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Add Transaction</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
            <IonSegment value={transactionType} onIonChange={e => setTransactionType(e.detail.value as string ?? 'deposit')}>
                    <IonSegmentButton value="deposit">
                        <IonLabel>Deposit</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="withdraw">
                        <IonLabel>Withdraw</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonInput
                            type="number"
                            value={numberInput}
                            placeholder="Enter Value of Transaction"
                            onIonChange={e => setNumberInput(e.detail.value!)}
                        />
                    </IonItem>
                    <IonButton expand="block" type="submit">Submit Number</IonButton>
                </form>
                <ul>
                    {numbers.map(({ id, balance }) => (
                        <IonItem key={id}>
                            {editId === id ? (
                                <IonInput
                                    value={editValue}
                                    onIonChange={(e) => setEditValue(e.detail.value!)}
                                    
                                />
                            ) : (
                                <IonLabel>{balance}</IonLabel>
                            )}
                            <IonButton onClick={() => startEditing(id, balance)}>Edit</IonButton>
                            
                            {editId === id && (
                                <IonButton onClick={() => saveEdit(id) }>Save</IonButton>
                                
                            )}
                        </IonItem>
                    ))}
                </ul>
            </IonContent>
        </IonPage>
    );
};

export default Tab2;
function fetchAndSetNumbers() {
  throw new Error('Function not implemented.');
}

