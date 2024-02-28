import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import { Chart as ChartJS } from "chart.js/auto";
import {
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
    labels: ["Billable", "Non Billable"],
    
    datasets: [
      {
        label: "Net gain",/*change to show the 7ish most resent dates */
        backgroundColor: "#53a45f",
        borderColor: "#102A43",
        borderWidth: 1,
        hoverBackgroundColor: "#8595bc",
        hoverBorderColor: "#206b52",
        data: [65, 59], /* change to rep the 7ish most recent values of net gain/loss*/
      },
    ],
  };

  return (
    <>
      <IonTitle>Net Gain </IonTitle>
      <Bar className="brand" data={data} />
    </>
  );
};

export default Graph;