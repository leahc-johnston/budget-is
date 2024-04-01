import { collection, addDoc } from "@firebase/firestore";
import { firestore } from "../components/firebase"; 
import { Timestamp } from "@firebase/firestore";


import { BalanceData } from './firebasePull';




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

const pushTotals = async ({ userId, dailySum }: { userId: string, dailySum : number}) => {
    console.log(userId)
    const ref = collection(firestore, "dailyTotals"); // Ensure this is the correct collection name
    try {
        await addDoc(ref, { userId, dailySum, timestamp: Timestamp.fromDate(new Date()) });
        console.log("Transaction added successfully");
    } catch (err) {
        console.error("Error adding transaction to Firestore:", err);
    }

};

const pushPositives = async ({ userId, dailyDeposits }: { userId: string, dailyDeposits : number}) => {
    console.log(userId)
    const ref = collection(firestore, "dailyTotals"); // Ensure this is the correct collection name
    try {
        await addDoc(ref, { userId, dailyDeposits, timestamp: Timestamp.fromDate(new Date()) });
        console.log("Transaction added successfully");
    } catch (err) {
        console.error("Error adding transaction to Firestore:", err);
    }

};

const pushNegatives = async ({ userId, dailyWithdrawls }: { userId: string, dailyWithdrawls : number}) => {
    console.log(userId)
    const ref = collection(firestore, "dailyTotals"); // Ensure this is the correct collection name
    try {
        await addDoc(ref, { userId, dailyWithdrawls, timestamp: Timestamp.fromDate(new Date()) });
        console.log("Transaction added successfully");
    } catch (err) {
        console.error("Error adding transaction to Firestore:", err);
    }

};
let totalSum : number;
let totalPos: number;
let totalNeg: number;

const pushAllTotals = (totalSum: number, totalPos: number, totalNeg: number, userId: string) => {
    console.log(userId);
    pushTotals({userId: userId, dailySum : totalSum});
    pushPositives({userId: userId, dailyDeposits : totalPos});
    pushNegatives({userId: userId, dailyWithdrawls : totalNeg});
};



export { pushNumber, pushTotals, pushPositives, pushNegatives, pushAllTotals };
