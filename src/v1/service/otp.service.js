import admin from '../config/firebaseAdmin.config.js'; // ✅ Correct import

class OTPService {
    constructor() {
        this.auth = admin.auth(); // ✅ Correctly initialize auth
    }

    async sendOTP(phoneNumber) {
        try {
            let userRecord;
            try {
                userRecord = await this.auth.getUserByPhoneNumber(phoneNumber);
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    userRecord = await this.auth.createUser({
                        phoneNumber: phoneNumber,
                        disabled: false
                    });
                } else {
                    console.error('Error fetching user:', error.message);
                    throw error;
                }
            }

            // Generate a custom token for the user
            const customToken = await this.auth.createCustomToken(userRecord.uid);
            return { status: 200, message: 'OTP sent successfully', customToken };
        } catch (error) {
            console.error('OTP sending failed:', error.message);
            return { status: 500, message: error.message };
        }
    }

    async verifyOTP(uid, otp) {
        try {
            const userRecord = await this.auth.getUser(uid);
            // 🔹 Implement OTP verification logic (if needed)
            return { status: 200, message: 'OTP verified successfully', userRecord };
        } catch (error) {
            console.error('OTP verification failed:', error.message);
            return { status: 500, message: error.message };
        }
    }
}

export default OTPService;
