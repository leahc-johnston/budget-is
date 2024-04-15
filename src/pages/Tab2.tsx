import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import { fetchBalances, updateBalance } from '../components/firebasePull';
import './Tab2.css';
import { pushNumber } from '../components/firebasePush';
import { useUser } from "../components/context";

const start = new Date();
const startHour = start.getHours();
const startDay = start.getDate().toString();
localStorage.setItem('lastCheckedDayTab2', startDay); //starting day

const Tab2: React.FC = () => {
    const { register, handleSubmit, setValue, watch, reset } = useForm();
    const [transactionType, setTransactionType] = useState<string>('deposit');
    const [numbers, setNumbers] = useState<{ id: string, balance: number }[]>([]);
    const [editId, setEditId] = useState<string | null>(null); // for identifying transaction being edited
    const { userId } = useUser();
    const [count, setCount] = useState(0);
    const contentRef = useRef<HTMLIonContentElement>(null);
    useEffect(() => {
        // Calculate the height of the content
        const contentHeight = document.body.scrollHeight;
        if (contentRef.current) {
          // Set the height of the IonContent dynamically
          contentRef.current.style.height = `${contentHeight}px`;
        }
      }, []);
    
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
            //setEditId(null); // Reset edit state
            reset({ numberInput: '' }); // Reset form fields
            fetchAndSetNumbers(); // Refresh numbers list
        } catch (error) {
            console.error("Error submitting form: ", error);
            alert('An error occurred while processing your transaction.');
        }
        window.location.reload();
    };

    const startEditing = (id: string, balance: number) => {
        console.log("we clicked")
        console.log(balance)
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
    useEffect(() => {
        // This code will run after every render
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDate().toString();
        if (/*currentHour === 0 && */currentDay !== localStorage.getItem('lastCheckedDayTab2')) 
        {
            window.location.reload;
            localStorage.setItem('lastCheckedDayTab2', currentDay);
        }
      }, [count]); // The effect will re-run whenever `count` changes
    
      const incrementCount = () => {
        setCount(prevCount => prevCount + 1);
      };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className='beautiful'>Add Transaction</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen ref={contentRef} className="content-pad">
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
                    <IonItem className ='inputBox' style={{width: '100%'}}>
                        <IonInput
                            type="number"
                            step="any"
                            {...register('numberInput')}
                            onIonChange={
                                e => {
                                console.log("input changed: ", e.detail.value)
                                setValue('numberInput', e.detail.value!)}}

                            placeholder="Enter Value of Transaction"
                            
                        />
                    </IonItem>
                    <IonButton expand="block" type="submit">{editId ? "Save Changes" : "Submit Number"}</IonButton>
                </form>
                <ul style={{overflowY: 'scroll'}}>
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
