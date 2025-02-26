import { auth } from '../config/firebaseAdmin.config.js';

class OTPService {
    async sendOTP(phoneNumber) {
        try {
            // Verify if the user already exists
            let userRecord;
            try {
                userRecord = await auth.getUserByPhoneNumber(phoneNumber);
            } catch (error) {
                // If the user doesn't exist, create a new user
                if (error.code === 'auth/user-not-found') {
                    userRecord = await auth.createUser({
                        phoneNumber: phoneNumber,
                        disabled: false
                    });
                } else {
                    throw error;
                }
            }

            // Generate a custom token for the user
            const customToken = await auth.createCustomToken(userRecord.uid);
            return { status: 200, message: 'OTP sent successfully', customToken };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async verifyOTP(uid, otp) {
        try {
            const userRecord = await auth.getUser(uid);
            // Implement your OTP verification logic here
            return { status: 200, message: 'OTP verified successfully', userRecord };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default OTPService;