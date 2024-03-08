import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import chart components
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../components/firebase'; // Import your Firestore instance

interface GraphData {
  balance: number;
  userId: string;
  timestamp: string;
}




const GraphComponent = () => {
    //const [graphData, setGraphData] = useState([]);
    const [graphData, setGraphData] = useState<GraphData[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const entriesCollection = collection(firestore, 'dailyTotals');
            const q = query(entriesCollection);
            try {
                const querySnapshot = await getDocs(q);
                //const data = [];
                const data: GraphData[] = [];
                querySnapshot.forEach((doc) => {
                    const entry = doc.data();
                    data.push({
                        balance: entry.balance,
                        userId: entry.userId,
                        timestamp: entry.timestamp.toDate().toISOString() // Convert Firestore timestamp to string
                    });
                });
                setGraphData(data);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
        };
        fetchData();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={graphData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="timestamp" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default GraphComponent;




































/* import { Bar } from "react-chartjs-2";

import { CategoryScale } from "chart.js";
import { Chart as ChartJS } from "chart.js/auto";
import {
  IonPage,
  IonTitle,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import './Tab3.css';

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getFirestore, collection, getDocs } from 'firebase/firestore';


//const Graph: React.FC = () => {
  useIonViewWillEnter(() => {
    ChartJS.register(CategoryScale);
  }, []);

  useIonViewWillLeave(() => {
    ChartJS.unregister(CategoryScale);
  }, []);
  const GraphComponent = () => {
    //const [graphData, setGraphData] = useState([]);
    const [graphData, setGraphData] = useState<DataPoint[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore();
            const querySnapshot = await getDocs(collection(db, 'your_collection_name'));
            const data = querySnapshot.docs.map(doc => doc.data());
            setGraphData(data);
        };
        fetchData();
    }, []);

    // Process your data into labels and values for the graph
    const labels = graphData.map(item => item.label);
    const values = graphData.map(item => item.value);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Your Data',
                data: values,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

   const data = {
    labels: ["Billable", "Non Billable"],/*change to show the 7ish most resent dates 
    
    datasets: [
      {
        label: "Net gain",
        
        backgroundColor: "#206b52",
        borderColor: "#102A43",
        borderWidth: 1,
        hoverBackgroundColor: "#8595bc",
        hoverBorderColor: "#206b52",
        
        data: [65, -59], /* change to rep the 7ish most recent values of net gain/loss*/
 /*       },
    ],
  };  

  return (
    <IonPage>
      <IonTitle className="thing">Net Gain </IonTitle>
      <Bar className="brand" data={data} />
    </IonPage>
  );
};

export default GraphComponent;  */

