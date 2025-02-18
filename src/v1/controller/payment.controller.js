import PaymentService from "../service/payment.service.js";

const paymentService = new PaymentService();

class PaymentController {
    //  Create Payment Order API (Backend generates payment link)
    async createOrder(req, res) {
        try {
            const { amount, currency, customerEmail, customerPhone, orderId } = req.body;

            if (!amount || !customerEmail || !customerPhone || !orderId) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            const result = await paymentService.createOrder(amount, currency, customerEmail, customerPhone, orderId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    //  Verify Payment API (Backend checks payment status)
    async verifyPayment(req, res) {
        try {
            const { orderId } = req.body;

            if (!orderId) {
                return res.status(400).json({ success: false, message: "Order ID is required" });
            }

            const result = await paymentService.verifyPayment(orderId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default PaymentController;
