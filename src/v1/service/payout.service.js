import Employee from '../model/Employee.model.js';

class PayoutService {
    async requestPayout(data) {
        try {
            const { user_id, amount, method } = data;
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            let payoutDetails;
            if (method === 'bank') {
                payoutDetails = employee.bankAccount;
            } else if (method === 'wallet') {
                payoutDetails = employee.walletLink;
            } else if (method === 'upi') {
                payoutDetails = employee.upiId;
            } else {
                return { status: 400, message: 'Invalid payout method' };
            }
            const payout = { amount, method, payoutDetails };
            employee.payouts.push(payout); // Ensure payouts field is being used correctly
            await employee.save();
            return { status: 201, message: 'Payout requested successfully', payout };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async getPayoutHistory(user_id) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            return { status: 200, message: 'Payout history retrieved successfully', payouts: employee.payouts };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default PayoutService;