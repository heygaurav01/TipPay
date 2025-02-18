import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

class PaymentService {
    constructor() {
        this.cashfreeUrl = process.env.CASHFREE_ENV === "production"
            ? "https://api.cashfree.com/pg/orders"
            : "https://sandbox.cashfree.com/pg/orders";
    }

    //  Create a Payment Order (Backend generates a payment link)
    async createOrder(amount, orderId, currency = "INR") {
        try {
            const headers = {
                "Content-Type": "application/json",
                "x-api-version": "2025-02-18", // ✅ Updated API Version
                "x-client-id": process.env.CASHFREE_APP_ID,
                "x-client-secret": process.env.CASHFREE_SECRET_KEY
            };

            const body = {
                order_amount: amount,
                order_id: orderId,
                order_currency: currency,
                customer_details: {
                    customer_id: "565656",
                    customer_phone: "9917014709",
                    customer_email: "gsharma7078969894@gmail.com",
                    customer_name: "Gaurav Sharma",
                    customer_bank_account_number: "9917014709",
                    customer_bank_ifsc: "AIRP0000001"
                },
                terminal: {
                    terminal_address: "Anand International College of Engineering"
                },
                order_meta: {
                    notify_url: "https://webhook.site/e39b18c1-d823-45fc-ae7d-7330ad28d298",
                    payment_methods: "cc,dc,upi"
                },
                order_note: "Tippay"
            };

            const response = await fetch(this.cashfreeUrl, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });

            const result = await response.json();
            if (result.payment_link) {
                return { success: true, paymentLink: result.payment_link };
            } else { console.log(response.data);

                throw new Error("Failed to create payment order");
            }
        } catch (error) {
            console.error(" Cashfree Order Creation Failed:", error);
            return { success: false, message: error.message };
        }
    }

    //  Verify Payment Status
    async verifyPayment(orderId) {
        try {
            const response = await fetch(`${this.cashfreeUrl}/${orderId}`, {
                method: "GET",
                headers: {
                    "x-api-version": "2025-02-18",
                    "x-client-id": process.env.CASHFREE_APP_ID,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY
                }
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error(" Payment Verification Failed:", error);
            return { success: false, message: error.message };
        }
    }
}

export default PaymentService;
