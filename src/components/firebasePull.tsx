import { collection, getDocs, query, where, Firestore } from "@firebase/firestore";
import { firestore } from "../components/firebase";
import { addDoc } from "firebase/firestore";


type test = {
    value: number;
};



export type BalanceData = {
    balance: number;
};


// Function to retrieve numbers from Firestore
const fetchBalances = async (): Promise<number[]> => {
    const testCollection = collection(firestore, "test");

    try {
        const querySnapshot = await getDocs(testCollection);
        const balances = querySnapshot.docs.map(doc => doc.data().balance as number);
        return balances;
    } catch (err) {
        console.error("Error fetching balances:", err);
        return [];
    }
};

export { fetchBalances };


type TestData = {
    // Define structure later
};

const handleSubmit = async (testdata: TestData) => {
    const ref = collection(firestore, "test");

    let data = {
        balance: testdata
    };

    try {
        await addDoc(ref, data);
    } catch(err) {
        console.error(err);
    }
};

export default handleSubmit;
