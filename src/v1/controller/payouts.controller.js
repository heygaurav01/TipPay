import PayoutsService from "../service/payouts.service.js";

const payoutsService = new PayoutsService();

class PayoutsController {
    async addBeneficiary(req, res) {
        try {
            const result = await payoutsService.addBeneficiary(req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async initiatePayout(req, res) {
        try {
            const { transferId, amount, beneficiaryId, transferMode } = req.body;
            const result = await payoutsService.initiatePayout({ transferId, amount, beneficiaryId, transferMode });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async checkPayoutStatus(req, res) {
        try {
            const { transferId } = req.params;
            const result = await payoutsService.checkPayoutStatus(transferId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default PayoutsController;
