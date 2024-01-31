import { collection, addDoc } from "@firebase/firestore";
import { firestore } from "../components/firebase"; 

import { BalanceData } from './firebasePull';

//push data function
const pushNumber = async (number: number): Promise<void> => {
    const data = { balance: number };
    
    const ref = collection(firestore, "balance");

    try {
        await addDoc(ref, data);
        console.log("Number added successfully");
    } catch (err) {
        console.error("Error adding number to Firestore:", err);
    }
};

export { pushNumber };
