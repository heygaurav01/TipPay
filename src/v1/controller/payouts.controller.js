import PayoutsService from "../service/payouts.service.js";

const payoutsService = new PayoutsService();

class PayoutsController {
    async authenticate(req, res) {
        try {
            const { user_id, token } = req.body;
            if (!user_id || !token) {
                return res.status(400).json({ success: false, message: "Missing user_id or token" });
            }

            // Example Authentication Logic (Modify as needed)
            if (token === "secure_token") {
                return res.status(200).json({ success: true, message: "Authentication successful" });
            } else {
                return res.status(401).json({ success: false, message: "Invalid token" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

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
