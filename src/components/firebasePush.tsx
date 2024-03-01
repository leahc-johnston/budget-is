import { collection, addDoc } from "@firebase/firestore";
import { firestore } from "../components/firebase"; 
import { Timestamp } from "@firebase/firestore";


import { BalanceData } from './firebasePull';

import {useUser} from './context';


//push data function
const pushNumber = async ({ userId, balance }: { userId: string, balance: number }) => {
    const ref = collection(firestore, "balance"); // Changed to the correct collection name
    try {
        await addDoc(ref, { userId, balance, timestamp: Timestamp.fromDate(new Date()) });
        console.log("Balance added successfully");
    } catch (err) {
        console.error("Error adding balance to Firestore:", err);
    }
};

const pushTotals = async ({ dailySum }: { dailySum : number }) => {
    const ref = collection(firestore, "test"); // Ensure this is the correct collection name
    try {
        await addDoc(ref, { dailySum });
        console.log("Transaction added successfully");
    } catch (err) {
        console.error("Error adding transaction to Firestore:", err);
    }

};

const pushPositives = async ({ dailyDeposits }: { dailyDeposits : number }) => {
    const ref = collection(firestore, "test"); // Ensure this is the correct collection name
    try {
        await addDoc(ref, { dailyDeposits });
        console.log("Transaction added successfully");
    } catch (err) {
        console.error("Error adding transaction to Firestore:", err);
    }

};

const pushNegatives = async ({ dailyWithdrawls }: { dailyWithdrawls : number }) => {
    const ref = collection(firestore, "test"); // Ensure this is the correct collection name
    try {
        await addDoc(ref, { dailyWithdrawls });
        console.log("Transaction added successfully");
    } catch (err) {
        console.error("Error adding transaction to Firestore:", err);
    }

};
let totalSum : number;
let totalPos: number;
let totalNeg: number;

const pushAllTotals = (totalSum: number, totalPos: number, totalNeg: number) => {
    pushTotals({dailySum : totalSum});
    pushPositives({dailyDeposits : totalPos});
    pushNegatives({dailyWithdrawls : totalNeg});
  };



export { pushNumber, pushTotals, pushPositives, pushNegatives, pushAllTotals };
