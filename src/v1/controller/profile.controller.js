import ProfileService from "../service/profile.service.js";

const profileService = new ProfileService();

class ProfileController {
    createProfile = async (req, res) => {
        try {
            const data = {
                name: req.body.name,
                photo: req.body.photo,
                designation: req.body.designation,
                user_id: req.user_id
            };
            let result = await profileService.createProfile(data);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    updateProfile = async (req, res) => {
        try {
            const data = {
                name: req.body.name,
                photo: req.body.photo,
                designation: req.body.designation,
                user_id: req.user_id
            };
            let result = await profileService.updateProfile(data);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    updateBankDetails = async (req, res) => {
        try {
            const data = {
                bank_account: req.body.bank_account,
                ifsc: req.body.ifsc,
                user_id: req.user_id
            };
            let result = await profileService.updateBankDetails(data);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }

    linkWallet = async (req, res) => {
        try {
            const data = {
                wallet_id: req.body.wallet_id,
                user_id: req.user_id
            };
            let result = await profileService.linkWallet(data);
            return res.status(result.status).json(result);
        } catch (err) {
            return res.status(500).json({
                'success': false,
                'message': err.message
            });
        }
    }
}

export default ProfileController;