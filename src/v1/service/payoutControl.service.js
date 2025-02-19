import Employee from "../model/Employee.model.js";

class PayoutControlService {
    // Authorize payout for an employee
    async authorizePayout(employeeId, amount, method) {
        try {
            const employee = await Employee.findById(employeeId);
            if (!employee) {
                return { status: 404, message: "Employee not found" };
            }

            const totalTips = employee.tips.reduce((sum, tip) => sum + tip.amount, 0);
            if (amount > totalTips) {
                return { status: 400, message: "Insufficient tip balance for payout" };
            }

            // Create new payout record
            const newPayout = {
                amount,
                method,
                status: "pending",
                date: new Date()
            };

            employee.payouts.push(newPayout);
            await employee.save();

            return { status: 200, message: "Payout authorized successfully", payout: newPayout };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    // Set automated payout schedule for an employee
    async setPayoutSchedule(employeeId, schedule) {
        try {
            const validSchedules = ["weekly", "biweekly", "monthly"];
            if (!validSchedules.includes(schedule)) {
                return { status: 400, message: "Invalid payout schedule" };
            }

            const employee = await Employee.findById(employeeId);
            if (!employee) {
                return { status: 404, message: "Employee not found" };
            }

            employee.payoutSchedule = schedule;
            await employee.save();

            return { status: 200, message: `Payout schedule updated to ${schedule}` };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default new PayoutControlService();
