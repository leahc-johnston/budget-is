import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, query, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../components/firebase'; // Make sure this path is correct
import { onAuthStateChanged } from 'firebase/auth';

interface GraphDataItem {
  id: string;
  timestamp: string; // Adjust the type as necessary, e.g., to Date or string depending on your usage
  // Include other fields from your Firestore document as needed
}

const GraphComponent = () => {
  // Explicitly define the type of the state variable using useState<GraphDataItem[]>()
  const [graphData, setGraphData] = useState<GraphDataItem[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchData = async () => {
          const balancesCollection = collection(firestore, 'balances');
          const q = query(balancesCollection);
          try {
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
              id: doc.id,
              timestamp: doc.data().timestamp.toDate().toISOString(), // Make sure to convert or adjust based on your data structure
              // Map other fields from your document as needed
            }));
            setGraphData(data);
          } catch (error) {
            console.error('Error fetching documents: ', error);
          }
        };

        fetchData();
      } else {
        console.log('User is not logged in');
      }
    });

    return () => unsubscribe();
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
