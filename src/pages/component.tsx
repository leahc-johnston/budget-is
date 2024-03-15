import { useEffect } from "react";
const A = () => {
//POTENTIAL TIME FUNCTION
    useEffect(() => {
        // Function to check the time and perform action if it's a new day
        const checkTimeAndPerformAction = () => {
          const now = new Date();
          const currentHour = now.getHours();
          const currentDay = now.getDate().toString();
    
          // Check if it's the top of the hour and a new day
          if (currentHour === 0 && currentDay !== localStorage.getItem('lastCheckedDay')) {
            // Perform your action here
            console.log("It's a new day!");
            
            // Store the current day to localStorage to track it
            localStorage.setItem('lastCheckedDay', currentDay.toString());
          }
        };
    
        // Run the check every minute
        const intervalId = setInterval(checkTimeAndPerformAction, 60000); // Check every minute
    
        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
      }, []); // Run only once when the component mounts
    return (
        console.log("hi")
    );
};

export default A;

