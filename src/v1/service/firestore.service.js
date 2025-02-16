import { db } from '../config/firebase.config.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

class FirestoreService {
    async addEmployee(employeeData) {
        try {
            const docRef = await addDoc(collection(db, 'employees'), employeeData);
            return { status: 201, message: 'Employee added successfully', docId: docRef.id };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async getEmployees() {
        try {
            const querySnapshot = await getDocs(collection(db, 'employees'));
            const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return { status: 200, employees };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default FirestoreService;