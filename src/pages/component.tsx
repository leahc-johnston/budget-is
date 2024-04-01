import React, { useEffect } from "react";
import { pushAllTotals } from "../components/firebasePush"; 
const A = () => {
//POTENTIAL TIME FUNCTION
    useEffect(() => {
        // Function to check the time and perform action if it's a new day
        const checkTimeAndPerformAction = () => {
          const now = new Date();
          const currentHour = now.getHours();
          const currentDay = now.getDate().toString();
    
          // Check if it's the top of the hour and a new day
          if (/*currentHour === 0 && */currentDay !== localStorage.getItem('lastCheckedDay')) {
            // Perform your action here
            console.log("It's a new day!");
            console.log("current day:", currentDay)
            console.log("currentHour:", currentHour)
            //pushAllTotals(totalSum, totalPos, totalNeg, userId);
            
            // Store the current day to localStorage to track it
            localStorage.setItem('lastCheckedDay', currentDay.toString());
          }
          else
            console.log("Didn't seem to work")
            console.log("current day:", currentDay)
            console.log("currentHour:", currentHour)
        };

        const intervalId = setInterval(checkTimeAndPerformAction, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, []);

    return null; // A does not render anything
};

export default A;
