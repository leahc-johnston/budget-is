import { collection, addDoc } from "@firebase/firestore";
import { firestore } from "../components/firebase"; 
import { Timestamp } from "@firebase/firestore";


import { BalanceData } from './firebasePull';

//push data function
const pushNumber = async ({ balance }: { balance: number }) => {
    const ref = collection(firestore, "test"); // Ensure this is the correct collection name
    try {
        await addDoc(ref, { balance });
        console.log("Transaction added successfully");
    } catch (err) {
        console.error("Error adding transaction to Firestore:", err);
    }

};

export { pushNumber };
