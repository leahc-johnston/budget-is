import { collection, getDocs, query, where, Firestore } from "@firebase/firestore";
import { firestore } from "../components/firebase";
import { addDoc } from "firebase/firestore";

// Assuming the structure of each document in your Firestore collection
type test = {
    value: number;
};

// Function to retrieve numbers from Firestore
const fetchBalances = async (): Promise<number[]> => {
    const testCollection = collection(firestore, "test");
    const q = query(testCollection, where("balance", ">", 0)); // Adjust the query as needed

    try {
        const querySnapshot = await getDocs(q);
        const balances = querySnapshot.docs.map(doc => doc.data().balance as number);
        return balances;
    } catch (err) {
        console.error("Error fetching balances:", err);
        return [];
    }
};


export { fetchBalances };

// Existing handleSubmit function (if needed, keep it as is)
type TestData = {
    // Define the structure of your test data here
};

const handleSubmit = async (testdata: TestData) => {
    const ref = collection(firestore, "test_data");

    let data = {
        testData: testdata
    };

    try {
        await addDoc(ref, data);
    } catch(err) {
        console.error(err);
    }
};

export default handleSubmit;
