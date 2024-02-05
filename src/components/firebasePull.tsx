import { collection, getDocs, query, where, Firestore } from "@firebase/firestore";
import { firestore } from "../components/firebase";
import { addDoc, doc, updateDoc } from "firebase/firestore";


type test = {
    value: number;
};



export type BalanceData = {
    balance: number;
};


// Function to retrieve numbers from Firestore
const fetchBalances = async (): Promise<{ id: string, balance: number }[]> => {
    const testCollection = collection(firestore, "test");

    try {
        const querySnapshot = await getDocs(testCollection);
        const balances = querySnapshot.docs.map(doc => ({
            id: doc.id,
            balance: doc.data().balance as number
        }));
        return balances;
    } catch (err) {
        console.error("Error fetching balances:", err);
        return [];
    }
};

export { fetchBalances };

export const pushNumber = async (entry: { balance: number }) => {
    const ref = collection(firestore, "test"); // Adjust "test" to your actual collection name
    try {
        const docRef = await addDoc(ref, entry);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

const sumAllBalances = async (): Promise<number> => {
    const testCollection = collection(firestore, "test"); // Ensure collection name is correct
    let sum = 0;

    try {
        const querySnapshot = await getDocs(testCollection);
        querySnapshot.forEach(doc => {
            const balance = doc.data().balance;
            if (typeof balance === 'number') { // Make sure balance is a number
                sum += balance;
            }
        });
        console.log("Total sum of balances:", sum);
        return sum;
    } catch (err) {
        console.error("Error fetching and summing balances:", err);
        return 0; // Return 0 or handle the error as needed
    }
};

export { sumAllBalances };


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
    const docRef = doc(firestore, "test", id);
    try {
        await updateDoc(docRef, { balance: newBalance });
        console.log("Balance updated successfully");
    } catch (err) {
        console.error("Error updating balance:", err);
    }
};

export default handleSubmit;
