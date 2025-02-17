import { auth } from '../config/firebaseAdmin.config.js';

class OTPService {
    async sendOTP(phoneNumber) {
        try {
            const userRecord = await auth.createUser({
                phoneNumber: phoneNumber,
                disabled: false
            });

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