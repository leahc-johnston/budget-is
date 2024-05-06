import React, { useState, useEffect, useRef } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { sumAllBalances, sumWithdrawl, sumDeposit, deleteOldData, deleteOldTotals } from '../components/firebasePull';
import { pushTotals, pushPositives, pushNegatives, pushAllTotals } from '../components/firebasePush';
import { useUser } from '../components/context'; // Ensure this path is correctly pointing to where your context is defined
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { useHistory } from 'react-router';
import { string } from 'yargs';
import { firestore } from "../components/firebase";
import { collection, addDoc, query, where } from "@firebase/firestore";



const start = new Date();
const startHour = start.getHours();
const startDay = start.getDate().toString();
localStorage.setItem('lastCheckedDay', startDay); //starting day

const Tab1: React.FC = () => {
  const [totalSum, setTotalSum] = useState<number>(0);
  const [totalNeg, setTotalNeg] = useState<number>(0);
  const [totalPos, setTotalPos] = useState<number>(0);
  const { userId } = useUser(); // Correctly using userId
  const history = useHistory();

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
    if(userId){
      const calculateAndSetWithdrawl = async () => {
      const sumNeg = await sumWithdrawl(userId); // Pass userId as argument
      setTotalNeg(sumNeg);
    };


    calculateAndSetWithdrawl();
    }
  }, [userId]); // Use userId as a dependency

  useEffect(() => {
    if(userId){

    const calculateAndSetDeposit = async () => {
      const sumPos = await sumDeposit(userId); // Pass userId as argument
      setTotalPos(sumPos);
    };

    calculateAndSetDeposit();
    }
  }, [userId]); // Use userId as a dependency

  //POTENTIAL TIME FUNCTION
  useEffect(() => {
    // Function to check the time and perform action if it's a new day
    const checkTimeAndPerformAction = async () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDate().toString();
      const { totalSum, totalPos, totalNeg } = parameters;
      // Check if it's the top of the hour and a new day
      if (/*currentHour === 0 && */currentDay !== localStorage.getItem('lastCheckedDay')) 
      {
        console.log("It's a new day!");
        console.log("current total sum: ", totalSum);
        console.log("current total deposit: ", totalPos);
        console.log("current total withdrawal: ", totalNeg);
        await pushAllTotals(totalSum, totalPos, totalNeg, userId);
        
        setTotalNeg(0);
        setTotalPos(0);
        setTotalSum(0);
        window.location.reload;
        console.log("current day:", currentDay)
        localStorage.setItem('lastCheckedDay', currentDay.toString());
        console.log("The new day is: ", currentDay);
        console.log("Value saved: ", localStorage.getItme('lastCheckedDay'));
       // window.location.reload();
      }
      else{
        console.log("Not a new day");
        console.log("The day is currently: ", now.getDate());
      }
    };
  
    const parameters = { totalSum, totalPos, totalNeg };
    // Run the check every minute
    const intervalId = setInterval(checkTimeAndPerformAction, 6); // Check every minute

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [totalSum, totalPos, totalNeg]); // Run only once when the component mounts  */


  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push('/login');
      window.location.reload();
      // Add any post-logout logic here, such as redirecting to the login page
    } catch (error) {
      console.error('Logout Error:', error);
      alert('An error occurred while logging out.');
    }


   


  };




  return (
    <IonPage >
        
      <IonHeader>
        <IonToolbar>
        <IonButton fill="clear" slot="start" className="logoutButton" onClick={handleLogout}>Logout</IonButton>
          <IonTitle size="large">Totals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={contentRef}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle className="title">Daily Totals</IonTitle> {/* Same here regarding the title */}
          </IonToolbar>
        </IonHeader>
        {/* Display the total sum of balances */}
        <div>
          <p className='beans'>Total Deposits </p>
          <p className='one'>{totalPos}</p>
          <p className='beans'>Total Withdrawal</p>
          <p className='one'>{totalNeg}</p>
          <p className='beans'>Total Sum </p>
          <p className='one'>{totalSum}</p>
       </div>
      
       {/* <IonButton className='total' onClick={() => pushAllTotals(totalSum, totalPos, totalNeg, userId)}>SUBMIT DAILY TOTALS</IonButton> */}

      </IonContent>
  
    </IonPage>
  );
};

export default Tab1;
