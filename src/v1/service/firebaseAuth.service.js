// firebaseAuth.service.js
import { auth } from '../config/firebaseAdmin.config.js';

class FirebaseAuthService {
    async verifyFirebaseToken(token) {
        try {
            const decodedToken = await auth.verifyIdToken(token);
            return { success: true, uid: decodedToken.uid };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

export default new FirebaseAuthService();