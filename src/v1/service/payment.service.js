import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

class PaymentService {
    constructor() {
        this.cashfreeUrl = process.env.CASHFREE_ENV === "production"
            ? "https://api.cashfree.com/pg/orders"
            : "https://sandbox.cashfree.com/pg/orders";

        console.log(" Cashfree API URL:", this.cashfreeUrl);
        console.log(" CASHFREE_APP_ID:", process.env.CASHFREE_APP_ID);
        console.log(" CASHFREE_SECRET_KEY:", process.env.CASHFREE_SECRET_KEY);
        console.log(" CASHFREE_ENV:", process.env.CASHFREE_ENV);
    }

    async createOrder(orderId, amount, currency = "INR") {
        try {
            if (!orderId || !amount) {
                throw new Error("Missing required parameters: orderId, amount");
            }

            const headers = {
                "Content-Type": "application/json",
                "x-api-version": "2023-08-01",
                "x-client-id": process.env.CASHFREE_APP_ID,
                "x-client-secret": process.env.CASHFREE_SECRET_KEY
            };

            const body = {
                order_amount: amount,
                order_id: orderId,  //  Fixed: order_id should be a unique string
                order_currency: currency, //  Fixed: order_currency should be "INR"
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

            console.log(" Sending Request:", JSON.stringify(body, null, 2));

            const response = await fetch(this.cashfreeUrl, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });

            const result = await response.json();
            console.log(" Cashfree Response:", result);

            if (result.code === "request_failed" && result.message.includes("authentication Failed")) {
                throw new Error("Authentication Failed: Please check your API credentials.");
            }

            if (result.payment_link) {
                return { success: true, paymentLink: result.payment_link };
            } else {
                throw new Error(`Cashfree API Error: ${result.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error(" Cashfree Order Creation Failed:", error);
            return { success: false, message: error.message };
        }
    }
}

export default PaymentService;
