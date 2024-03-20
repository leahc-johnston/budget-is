import { useEffect } from "react";

const A = () => {
        useEffect(() => {
          const checkTimeAndPerformAction = () => {
            const now = new Date();
            const storedDay = localStorage.getItem('lastCheckedDay');
            const currentDay = now.getDate().toString();
            const isNewDay = !storedDay || currentDay !== storedDay;

            if (isNewDay) {
                console.log("It's a new day!");
                localStorage.setItem('lastCheckedDay', currentDay);
            }
        };

        const intervalId = setInterval(checkTimeAndPerformAction, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, []);

    return null; // A does not render anything
};

export default A;
