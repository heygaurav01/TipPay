import { auth } from '../config/firebase.config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

class AuthService {
    async register(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return { status: 201, message: 'User registered successfully', user: userCredential.user };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { status: 200, message: 'User logged in successfully', user: userCredential.user };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default AuthService;