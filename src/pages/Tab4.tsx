import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Chart, ChartData } from 'chart.js/auto';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../components/firebase'; // Adjust the import path as necessary
import { useUser } from '../components/context'; // Ensure this is correctly typed in its own file

interface DailyTotal {
  dailyWithdrawls: number;
  dailyDeposits: number;
  dailySum: number;
  // Include other fields as necessary, assuming a date or similar for labeling
}

const ChartComponent: React.FC = () => {
  const { userId } = useUser();
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      const q = query(collection(firestore, 'dailyTotals'), where('userId', '==', userId));

      try {
        const querySnapshot = await getDocs(q);
        const data: DailyTotal[] = querySnapshot.docs.map((doc) => doc.data() as DailyTotal);

        const labels = data.map((_, index) => `Day ${index + 1}`);
        const dailyWithdrawls = data.map((entry) => entry.dailyWithdrawls);
        const dailyDeposits = data.map((entry) => entry.dailyDeposits);
        const dailySum = data.map((entry) => entry.dailySum);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Daily Withdrawals',
              data: dailyWithdrawls,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Daily Deposits',
              data: dailyDeposits,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
              label: 'Daily Sum',
              data: dailySum,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (chartData) {
      const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: chartData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [chartData]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Financial Data</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {chartData ? <canvas id="myChart"></canvas> : <p>Loading data...</p>}
      </IonContent>
    </IonPage>
  );
};

export default ChartComponent;
