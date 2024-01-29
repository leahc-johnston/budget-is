import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { fetchBalances} from '../components/firebasePull';
import { useState, useEffect } from 'react';

const Tab1: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([]);

  useEffect(() => {
    const fetchAndSetNumbers = async () => {
      const fetchedNumbers = await fetchBalances();
      setNumbers(fetchedNumbers);
    };

    fetchAndSetNumbers();
  }, []);
  
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Tab 2</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* Rest of your existing UI... */}
      
      {/* Display the retrieved numbers */}
      <div>
        <h2>Fetched Numbers:</h2>
        <ul>
          {numbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
    </IonContent>
  </IonPage>
  );
};

export default Tab1;
