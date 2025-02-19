import express from 'express';
import PaymentController from '../controller/payment.controller.js';

const router = express.Router();
const paymentController = new PaymentController();

// Payment Routes
router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);

// Webhook Route (Cashfree will notify payment status updates)
router.post('/webhook', async (req, res) => {
    console.log(" Payment Webhook Received:", req.body);
    res.status(200).json({ success: true });
});

export default (app) => {
    app.use('/api/v1/payments', router);
};
