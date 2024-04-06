import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Chart, ChartData } from 'chart.js/auto';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../components/firebase';
import { useUser } from '../components/context';

interface DailyTotal {
  dailyWithdrawls: number;
  dailyDeposits: number;
  dailySum: number;
  // Assume each entry represents a day, for simplicity
}

const ChartComponent: React.FC = () => {
  const { userId } = useUser();
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      const q = query(collection(firestore, 'dailyTotals'), where('userId', '==', userId));
      try {
        const querySnapshot = await getDocs(q);
        const data: DailyTotal[] = querySnapshot.docs.map(doc => doc.data() as DailyTotal);

        // Prepare data for chart
        const labels: string[] = [];
        const dailyWithdrawlsData: number[] = [];
        const dailyDepositsData: number[] = [];
        const dailySumData: number[] = [];

        // Grouping data: one label per each entry
        data.forEach((entry, index) => {
          // Assuming each entry is a day, adjust as needed
          labels.push(`Day ${Math.floor(index / 3) + 1}`);
          dailyWithdrawlsData.push(entry.dailyWithdrawls);
          dailyDepositsData.push(entry.dailyDeposits);
          dailySumData.push(entry.dailySum);
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Daily Withdrawals',
              data: dailyWithdrawlsData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Daily Deposits',
              data: dailyDepositsData,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
              label: 'Daily Sum',
              data: dailySumData,
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
      const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;

      const ctx = canvas?.getContext('2d');
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
