import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import { fetchBalances, updateBalance } from '../components/firebasePull';
import './Tab2.css';
import { pushNumber } from '../components/firebasePush';
import { useUser } from "../components/context";

const Tab2: React.FC = () => {
    const { register, handleSubmit, setValue, watch, reset } = useForm();
    const [transactionType, setTransactionType] = useState<string>('deposit');
    const [numbers, setNumbers] = useState<{ id: string, balance: number }[]>([]);
    const [editId, setEditId] = useState<string | null>(null); // for identifying transaction being edited
    const { userId } = useUser();

    useEffect(() => {
        if (userId) {
            const fetchAndSetNumbers = async () => {
                const fetchedNumbers = await fetchBalances(userId);
                setNumbers(fetchedNumbers);
            };
            fetchAndSetNumbers();
        }
    }, [userId]);

    useEffect(() => {
        register('numberInput'); // Register input field
    }, [register]);

    const onSubmit = async (data: any) => {
        const number = parseFloat(data.numberInput);

        if (isNaN(number) || number === 0) {
            alert('Please enter a valid number.');
            return;
        }

        if (!userId) {
            alert('User is not logged in.');
            return;
        }

        const balance = transactionType === 'withdraw' ? -Math.abs(number) : number;

        try {
            if (editId) {
                await updateBalance(editId, balance);
            } else {
                await pushNumber({ userId, balance });
            }
            setEditId(null); // Reset edit state
            reset({ numberInput: '' }); // Reset form fields
            fetchAndSetNumbers(); // Refresh numbers list
        } catch (error) {
            console.error("Error submitting form: ", error);
            alert('An error occurred while processing your transaction.');
        }
        window.location.reload();
    };

    const startEditing = (id: string, balance: number) => {
        setEditId(id);
        setValue('numberInput', balance.toString());
    };

    // Fetch and set numbers directly within the component
    const fetchAndSetNumbers = async () => {
        if (userId) {
            const fetchedNumbers = await fetchBalances(userId);
            setNumbers(fetchedNumbers);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className='beautiful'>Add Transaction</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
            <IonSegment 
                value={transactionType} 
                onIonChange={e => setTransactionType(e.detail.value as string)}
            >
                <IonSegmentButton value="deposit">
                    <IonLabel>Deposit</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="withdraw">
                    <IonLabel>Withdraw</IonLabel>
                </IonSegmentButton>
            </IonSegment>

                
                <form onSubmit={handleSubmit(onSubmit)} className='down'>
                    <IonItem>
                        <IonInput
                            type="number"
                            step="any"
                            {...register('numberInput')}
                            onIonChange={e => setValue('numberInput', e.detail.value!)}
                            placeholder="Enter Value of Transaction"
                        />
                    </IonItem>
                    <IonButton expand="block" type="submit">{editId ? "Save Changes" : "Submit Number"}</IonButton>
                </form>
                <ul>
                    {numbers.map(({ id, balance }) => (
                        <IonItem key={id}>
                            <IonLabel>{balance}</IonLabel>
                            <IonButton onClick={() => startEditing(id, balance)}>Edit</IonButton>
                        </IonItem>
                    ))}
                </ul>
   
            </IonContent>
        </IonPage>
    );
};

export default Tab2;
