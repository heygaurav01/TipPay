import express from 'express';
import PayoutsController from '../controller/payouts.controller.js';

const router = express.Router();
const payoutsController = new PayoutsController();

//  Add this missing route
router.post('/authenticate', async (req, res) => {
    try {
        const token = await payoutsController.authenticate();
        return res.status(200).json({ success: true, token });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

//  Existing routes
router.post('/add-beneficiary', payoutsController.addBeneficiary);
router.post('/initiate-payout', payoutsController.initiatePayout);
router.get('/check-payout/:transferId', payoutsController.checkPayoutStatus);

export default (app) => {
    app.use('/api/v1/payouts', router);
};
