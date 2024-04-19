import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Chart, ChartData } from 'chart.js/auto';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../components/firebase';
import { useUser } from '../components/context';
import { startOfToday, addDays, format } from 'date-fns';
import firebase from 'firebase/app';

interface DailyTotal {
  dailyWithdrawls: number;
  dailyDeposits: number;
  dailySum: number;
  timestamp: firebase.firestore.Timestamp; 
  // Assume each entry represents a day, for simplicity
}

const ChartComponent: React.FC = () => {
  const { userId } = useUser();
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      /*const startDate = addDays(startOfToday(), -6); // Start of today minus 6 days
      const endDate = startOfToday();*/
      const currentDate = new Date();
      const TODAY = new Date();
      const TODAYSdate = new Date(TODAY);
      TODAYSdate.setDate(TODAY.getDate());
      const sevenDays = new Date(currentDate);
      sevenDays.setDate(currentDate.getDate() -7);
      
      const q = query(collection(firestore, 'dailyTotals'), orderBy('timestamp', 'asc'), where('userId', '==', userId));
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
          const currentT = entry.timestamp.toDate(); //the timestamp of the entry
          if(currentT.getTime() >= sevenDays.getTime() && currentT.getTime() <= TODAYSdate.getTime())
          {
            //labels.push(`Day ${Math.floor(index / 3) + 1}`);
            
            const formatedDate = format(currentT, 'MMM, dd');
            labels.push(`Date: ${formatedDate}`);
            dailyWithdrawlsData.push(entry.dailyWithdrawls);
            dailyDepositsData.push(entry.dailyDeposits);
            dailySumData.push(entry.dailySum);
          }
          else{
            console.log("We found an entry that is older than 7 days and will not be using it!\n");
            console.log("Today is: ", TODAYSdate);
            console.log("The timestamp we are not using is: ", currentT); 
          }

          
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
            responsive: true, 
            maintainAspectRatio: false,
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
      <IonContent fullscreen id="A">
          {chartData ? <canvas id="myChart"></canvas> : <p>Loading data...</p>}  
      </IonContent>
    </IonPage>
  );
};

export default ChartComponent;


//things we still need to fix;
//1. delete function- being weird. 
//2. chart displaying things together and not saying each thing new day
//3. chart display only last 7 days. (modify function for different database 'dailyTotals')
