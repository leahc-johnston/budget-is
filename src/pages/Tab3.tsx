import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../components/firebase';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { useUser } from '../components/context';
import { IonPage } from '@ionic/react';

interface WeeklyTotal {
  dailyDeposits: number;
  dailyWithdrawals: number;
  dailySum: number;
}

interface WeeklyTotals {
  [key: string]: WeeklyTotal;
}

const Tab3: React.FC = () => {
  const [weeklyTotals, setWeeklyTotals] = useState<WeeklyTotals>({});
  const { userId } = useUser();
  
  useEffect(() => {
    if (!userId) {
      console.log("User ID is null, waiting for authentication...");
      return; // Exit the effect if userId is null
    }
    
    console.log("User ID: ", userId); // Now we're sure userId is not null
    
    const fetchWeeklyTotals = async () => {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

      const dailyTotalsRef = collection(firestore, 'dailyTotals');
      const q = query(
        dailyTotalsRef,
        where('userId', '==', userId),
        where('timestamp', '>=', weekStart),
        where('timestamp', '<=', weekEnd),
        orderBy('timestamp', 'asc')
      );

      try {
        const querySnapshot = await getDocs(q);
        const totalsByDay: WeeklyTotals = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const day = format(data.timestamp.toDate(), 'EEEE');

          totalsByDay[day] = totalsByDay[day] || { dailyDeposits: 0, dailyWithdrawals: 0, dailySum: 0 };

          totalsByDay[day].dailyDeposits += data.dailyDeposits || 0;
          totalsByDay[day].dailyWithdrawals += data.dailyWithdrawls || 0; // Note the typo in your field name
          totalsByDay[day].dailySum += data.dailySum || 0;
        });

        setWeeklyTotals(totalsByDay);
      } catch (error) {
        console.error("Error fetching weekly totals: ", error);
      }
    };

    fetchWeeklyTotals();
  }, [userId]);

  const renderWeeklyTotals = () => {
    return Object.entries(weeklyTotals).map(([day, totals]) => (
      <div key={day} >
        <h3 className='test'>{day}:</h3>
        <p className='test'>Total Deposits: {totals.dailyDeposits}</p>
        <p className='test'>Total Withdrawals: {totals.dailyWithdrawals}</p>
        <p className='test'>Total Sum: {totals.dailySum}</p>
      </div>
    ));
  };

  return (
    (<IonPage> <div>{renderWeeklyTotals()}</div>;</IonPage>)
  )
};

export default Tab3;
