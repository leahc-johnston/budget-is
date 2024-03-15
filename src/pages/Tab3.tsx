import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../components/firebase';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { useUser } from '../components/context';

interface WeeklyTotal {
  dailyDeposits: number;
  dailyWithdrawals: number;
  dailySum: number;
}

interface WeeklyTotals {
  [key: string]: WeeklyTotal;
}

const Tab3 = () => {
  const [weeklyTotals, setWeeklyTotals] = useState<WeeklyTotals>({});
  const { userId } = useUser();
  
  useEffect(() => {
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

      const querySnapshot = await getDocs(q);
      const totalsByDay: WeeklyTotals = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const day = format(data.timestamp.toDate(), 'EEEE'); // e.g., 'Monday'

        if (!totalsByDay[day]) {
          totalsByDay[day] = {
            dailyDeposits: 0,
            dailyWithdrawals: 0,
            dailySum: 0
          };
        }

        if (data.dailyDeposits) {
          totalsByDay[day].dailyDeposits += data.dailyDeposits;
        }
        if (data.dailyWithdrawls) {
          totalsByDay[day].dailyWithdrawals += data.dailyWithdrawls;
        }
        if (data.dailySum) {
          totalsByDay[day].dailySum += data.dailySum;
        }
      });

      setWeeklyTotals(totalsByDay);
    };

    fetchWeeklyTotals();
  }, [userId]);

  const renderWeeklyTotals = () => {
    return Object.entries(weeklyTotals).map(([day, totals]) => (
      <div key={day}>
        <h3>{day}:</h3>
        <p>Total Deposits: {totals.dailyDeposits}</p>
        <p>Total Withdrawals: {totals.dailyWithdrawals}</p>
        <p>Total Sum: {totals.dailySum}</p>
      </div>
    ));
  };

  return <div>{renderWeeklyTotals()}</div>;
};

export default Tab3;
