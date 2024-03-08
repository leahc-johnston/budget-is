import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import { Chart as ChartJS } from "chart.js/auto";
import {
  IonPage,
  IonTitle,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import './Tab3.css';
const Graph: React.FC = () => {
  useIonViewWillEnter(() => {
    ChartJS.register(CategoryScale);
  }, []);

  useIonViewWillLeave(() => {
    ChartJS.unregister(CategoryScale);
  }, []);

  const data = {
    labels: ["Billable", "Non Billable"],/*change to show the 7ish most resent dates */
    
    datasets: [
      {
        label: "Net gain",
        
        backgroundColor: "#206b52",
        borderColor: "#102A43",
        borderWidth: 1,
        hoverBackgroundColor: "#8595bc",
        hoverBorderColor: "#206b52",
        
        data: [100, -59], /* change to rep the 7ish most recent values of net gain/loss*/
      },
    ],
  };

  return (
    <IonPage>
      <IonTitle className="thing">Net Gain </IonTitle>
      <Bar className="brand" data={data} />
    </IonPage>
  );
};

export default Graph;