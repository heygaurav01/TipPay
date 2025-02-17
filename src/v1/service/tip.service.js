import Employee from '../model/Employee.model.js';

class TipService {
    async addTip(data) {
        try {
            const { user_id, amount, customerName, paymentMethod } = data;
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            const tip = { amount, customerName, paymentMethod };
            employee.tips.push(tip);
            await employee.save();
            return { status: 201, message: 'Tip added successfully', tip };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async getTips(user_id, period) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            let tips;
            const now = new Date();
            switch (period) {
                case 'daily':
                    tips = employee.tips.filter(tip => tip.date.toDateString() === now.toDateString());
                    break;
                case 'weekly':
                    const weekAgo = new Date(now.setDate(now.getDate() - 7));
                    tips = employee.tips.filter(tip => tip.date >= weekAgo);
                    break;
                case 'monthly':
                    const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                    tips = employee.tips.filter(tip => tip.date >= monthAgo);
                    break;
                default:
                    tips = employee.tips;
            }
            return { status: 200, message: 'Tips retrieved successfully', tips };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async getTipDetails(user_id, tip_id) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            const tip = employee.tips.id(tip_id);
            if (!tip) {
                return { status: 404, message: 'Tip not found' };
            }
            return { status: 200, message: 'Tip details retrieved successfully', tip };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default TipService;