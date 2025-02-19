import Employee from "../model/Employee.model.js";

class EmployerPerformanceService {
    // Get performance metrics for an employee
    async getEmployeePerformance(employeeId) {
        try {
            const employee = await Employee.findById(employeeId).lean();
            if (!employee) {
                return { status: 404, message: "Employee not found" };
            }

            const totalTips = employee.tips.reduce((sum, tip) => sum + tip.amount, 0);
            const totalReviews = employee.tips.flatMap(tip => tip.reviews);
            const avgRating = totalReviews.length
                ? (totalReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews.length).toFixed(1)
                : "No reviews yet";
            const totalCustomersServed = employee.tips.length;

            return {
                status: 200,
                performance: {
                    totalTips,
                    avgRating,
                    totalCustomersServed
                }
            };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    // Identify top performers
    async getTopPerformers(employerId) {
        try {
            const employees = await Employee.find({ employerId }).lean();

            const sortedEmployees = employees.map(emp => {
                const totalReviews = emp.tips.flatMap(tip => tip.reviews);
                const avgRating = totalReviews.length
                    ? (totalReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews.length).toFixed(1)
                    : 0;
                return { ...emp, avgRating };
            }).sort((a, b) => b.avgRating - a.avgRating);

            return { status: 200, topPerformers: sortedEmployees.slice(0, 5) }; // Return top 5 performers
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    // Flag low-performing employees
    async flagLowPerformers(employerId) {
        try {
            const employees = await Employee.find({ employerId }).lean();
            const lowPerformers = employees.filter(emp => {
                const totalReviews = emp.tips.flatMap(tip => tip.reviews);
                const avgRating = totalReviews.length
                    ? (totalReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews.length).toFixed(1)
                    : 0;
                return avgRating < 2.5; // Flag employees with avg rating below 2.5
            });

            await Employee.updateMany(
                { _id: { $in: lowPerformers.map(emp => emp._id) } },
                { $set: { lowPerformanceFlag: true } }
            );

            return { status: 200, message: "Low performers flagged successfully", lowPerformers };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default new EmployerPerformanceService();
