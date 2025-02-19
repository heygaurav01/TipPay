import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

class PayoutsService {
    constructor() {
        // Corrected API URL
        this.cashfreePayoutUrl = process.env.CASHFREE_PAYOUT_ENV === "production"
            ? "https://payout-api.cashfree.com/payout/v1"
            : "https://payout-api.cashfree.com/payout/v1";  //  FIXED URL

        console.log(" Cashfree Payouts API URL:", this.cashfreePayoutUrl);
        console.log(" CASHFREE_PAYOUT_CLIENT_ID:", process.env.CASHFREE_PAYOUT_CLIENT_ID);
    }

    //  Generate Authentication Token
    async getAuthToken() {
        try {
            const response = await fetch(`${this.cashfreePayoutUrl}/authorize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Client-Id": process.env.CASHFREE_PAYOUT_CLIENT_ID,
                    "X-Client-Secret": process.env.CASHFREE_PAYOUT_SECRET_KEY,
                    "X-Secure-Id": process.env.CASHFREE_PAYOUT_SECURE_ID  // ✅ Include Secure ID
                }
            });

            const result = await response.json();
            console.log(" Auth Token Response:", result);

            if (result.status === "SUCCESS") {
                return result.data.token;
            } else {
                throw new Error(`Cashfree Payouts Auth Error: ${result.message}`);
            }
        } catch (error) {
            console.error(" Cashfree Payouts Auth Failed:", error);
            return null;
        }
    }

    //  Add Beneficiary
    async addBeneficiary(beneficiaryData) {
        try {
            const authToken = await this.getAuthToken();
            if (!authToken) throw new Error("Failed to fetch auth token.");

            const response = await fetch(`${this.cashfreePayoutUrl}/addBeneficiary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                    "X-Secure-Id": process.env.CASHFREE_PAYOUT_SECURE_ID  // ✅ Include Secure ID
                },
                body: JSON.stringify(beneficiaryData)
            });

            const result = await response.json();
            console.log(" Add Beneficiary Response:", result);
            return result;
        } catch (error) {
            console.error(" Failed to Add Beneficiary:", error);
            return { success: false, message: error.message };
        }
    }
    
}

export default PayoutsService;
