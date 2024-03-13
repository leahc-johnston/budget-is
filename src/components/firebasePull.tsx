import { collection, getDocs, query, where, Firestore } from "@firebase/firestore";
import { firestore } from "../components/firebase";
import { addDoc, doc, updateDoc } from "firebase/firestore";
import { useUser } from "./context";


type test = {
    value: number;
};



export type BalanceData = {
    balance: number;
};


// Function to retrieve numbers from Firebase
const fetchBalances = async (userId: string): Promise<{ id: string, balance: number }[]> => {
    const balanceCollection = collection(firestore, "balance"); // Reference to 'balance' collection
    const q = query(balanceCollection, where("userId", "==", userId)); // Updated to use "userId"

    try {
        const querySnapshot = await getDocs(q);
        const balances = querySnapshot.docs.map(doc => ({
            id: doc.id,
            balance: doc.data().balance as number // Assuming 'balance' is correctly named
        }));
        console.log("Fetched balances:", balances); // Useful for debugging
        return balances;
    } catch (err) {
        console.error("Error fetching balances:", err);
        return [];
    }
};
export {fetchBalances}

//adds new balance to firebase
/* export const pushNumber = async (entry: { balance: number }) => {
    const ref = collection(firestore, "test"); // test is collection name
    try {
        //adds new document with entered data
        const docRef = await addDoc(ref, entry);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}; */

const sumAllBalances = async (userId: string): Promise<number> => {
    const balanceCollection = collection(firestore, "balance"); // Assuming the correct collection name is "balance"
    let sum = 0;

    try {
        // Create a query that filters documents by userId
        const q = query(balanceCollection, where("userId", "==", userId));

        // Fetch documents from collection that match the query
        const querySnapshot = await getDocs(q);

        // Sum balance values for documents that match the userId
        querySnapshot.forEach(doc => {
            const balance = doc.data().balance;
            if (typeof balance === 'number') { // Make sure balance is a number
                sum += balance;
            }
        });

        console.log("Total sum of balances for userId", userId, ":", sum);
        return sum;
    } catch (err) {
        console.error("Error fetching and summing balances:", err);
        return 0; 
    }
};

export { sumAllBalances };

const sumWithdrawl = async (userId: string): Promise<number> => {
    const balanceCollection = collection(firestore, "balance"); // Assuming "balance" is the correct collection name
    let sumNeg = 0;

    try {
        // Create a query that filters documents by userId
        const q = query(balanceCollection, where("userId", "==", userId));

        // Fetch documents from collection that match the query
        const querySnapshot = await getDocs(q);

        // Sum negative balance values for documents that match the userId
        querySnapshot.forEach(doc => {
            const balance = doc.data().balance;
            if (typeof balance === 'number' && balance < 0) { // Check if balance is a negative number
                sumNeg += balance;
            }
        });

        console.log("Total sum of withdrawals for userId", userId, ":", sumNeg);
        return sumNeg;
    } catch (err) {
        console.error("Error fetching and summing withdrawals:", err);
        return 0; 
    }
};

export{sumWithdrawl}

const sumDeposit = async (userId: string): Promise<number> => {
    const balanceCollection = collection(firestore, "balance"); // Assuming "balance" is the correct collection name
    let sumPos = 0;

    try {
        // Create a query that filters documents by userId
        const q = query(balanceCollection, where("userId", "==", userId));

        // Fetch documents from collection that match the query
        const querySnapshot = await getDocs(q);

        // Sum positive balance values for documents that match the userId
        querySnapshot.forEach(doc => {
            const balance = doc.data().balance;
            if (typeof balance === 'number' && balance >= 0) { // Check if balance is a positive number
                sumPos += balance;
            }
        });

        console.log("Total sum of deposits for userId", userId, ":", sumPos);
        return sumPos;
    } catch (err) {
        console.error("Error fetching and summing deposits:", err);
        return 0; 
    }
};
export{sumDeposit}
type TestData = {
    // Define structure later
};

const handleSubmit = async (testdata: TestData) => {
    const ref = collection(firestore, "test");

    try {
        await addDoc(ref, testdata); // Directly use testdata here
    } catch(err) {
        console.error("Error adding document:", err);
    }
};


export const updateBalance = async (id: string, newBalance: number): Promise<void> => {
    const docRef = doc(firestore, "balance", id);
    try {
        await updateDoc(docRef, { balance: newBalance });
        console.log("Balance updated successfully");
    } catch (err) {
        console.error("Error updating balance:", err);
    }
};

export default handleSubmit;
