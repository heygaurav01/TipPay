import Employee from "../model/Employee.model.js";

class EmployerService {
    // Fetch all employees assigned to a particular employer
    async getEmployeesByEmployer(employerId) {
        try {
            const employees = await Employee.find({ employerId })
                .select("fullName email jobTitle department location status tips")
                .lean();

            // Calculate total tips and average rating for each employee
            const employeeData = employees.map(emp => {
                const totalTips = emp.tips.reduce((sum, tip) => sum + tip.amount, 0);
                const totalReviews = emp.tips.flatMap(tip => tip.reviews);
                const avgRating = totalReviews.length
                    ? (totalReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews.length).toFixed(1)
                    : "No reviews yet";

                return {
                    ...emp,
                    totalTips,
                    avgRating
                };
            });

            return { status: 200, employees: employeeData };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    // Deactivate or Reactivate Employee
    async updateEmployeeStatus(employeeId, status) {
        try {
            const employee = await Employee.findByIdAndUpdate(employeeId, { status }, { new: true });

            if (!employee) {
                return { status: 404, message: "Employee not found" };
            }

            return { status: 200, message: `Employee status updated to ${status}`, employee };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default new EmployerService();
