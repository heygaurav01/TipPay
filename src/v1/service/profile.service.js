import Profile from '../model/Profile.model.js'; // Assuming you have a Profile model

class ProfileService {
    async createProfile(data) {
        try {
            const newProfile = new Profile(data);
            await newProfile.save();
            return { status: 201, message: "Profile created successfully", profile: newProfile };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }

    async updateProfile(data) {
        try {
            const updatedProfile = await Profile.findByIdAndUpdate(data.user_id, data, { new: true });
            if (!updatedProfile) {
                return { status: 404, message: "Profile not found" };
            }
            return { status: 200, message: "Profile updated successfully", profile: updatedProfile };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }

    async updateBankDetails(data) {
        try {
            const updatedProfile = await Profile.findByIdAndUpdate(data.user_id, { bank_account: data.bank_account, ifsc: data.ifsc }, { new: true });
            if (!updatedProfile) {
                return { status: 404, message: "Profile not found" };
            }
            return { status: 200, message: "Bank details updated successfully", profile: updatedProfile };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }

    async linkWallet(data) {
        try {
            const updatedProfile = await Profile.findByIdAndUpdate(data.user_id, { wallet_id: data.wallet_id }, { new: true });
            if (!updatedProfile) {
                return { status: 404, message: "Profile not found" };
            }
            return { status: 200, message: "Wallet linked successfully", profile: updatedProfile };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }
}

export default ProfileService;