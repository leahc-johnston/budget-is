import { collection, getDocs, query, where, deleteDoc, Firestore} from "@firebase/firestore";
//import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from "../components/firebase";
import { addDoc, doc, updateDoc,  } from "firebase/firestore";
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

const deleteOldData = async (firestoreDB: Firestore, userId: string) => {
    // Calculate the cutoff date
    //const cutoffDate = new Date();
    //cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    // Get the current day's date
    //const currentDate = new Date();
    //const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    const collectionRef = collection(firestoreDB, 'balance');
    const q = query(
      collectionRef,
        where('userId', '==', userId), // Filter by the userId
        //where('timestamp', '<=', currentDay),
    );
  
    try {
      const querySnapshot = await getDocs(q);
  
      // Iterate over each document
      querySnapshot.forEach((document) => {
        //const dateTimestamp = document.timestamp().toDate(); // Assuming 'date' is a Timestamp field
        //const documentDate = dateTimestamp.toDate(); // Convert Timestamp to Date
  
        // Check if the document's date is not equal to the current day's date
        //if (documentDate < currentDay) {
          // Delete the document
          deleteDoc(doc(firestoreDB, 'balance', document.id));
        });
  
      console.log('Old data tied to the userId has been successfully deleted.');
    } catch (error) {
      console.error('Error deleting old data: ', error);
    }
  };

/* const deleteOldData = async (firestoreDB: Firestore, userId: string, daysOld: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
    const collectionRef = collection(firestoreDB, 'balance');
    const q = query(
      collectionRef,
      where('userId', '==', userId), // Filter by the userId
      where('date', '<', cutoffDate) // Filter by the cutoffDate
    );
  
    try {
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map((document) => {
        return deleteDoc(doc(firestoreDB, 'balance', document.id));
      });
  
      // Wait for all delete operations to complete
      await Promise.all(deletePromises);
      console.log('Old data tied to the userId has been successfully deleted.');
    } catch (error) {
      console.error('Error deleting old data: ', error);
    }
  }; */
export { deleteOldData}


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
    const ref = collection(firestore, "balance");

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
