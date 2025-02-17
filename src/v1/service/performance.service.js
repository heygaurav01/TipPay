import Employee from '../model/Employee.model.js';

class PerformanceService {
    async getPerformance(user_id, period) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            let tips;
            const now = new Date();
            switch (period) {
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
            const totalEarnings = tips.reduce((sum, tip) => sum + tip.amount, 0);
            const numberOfTips = tips.length;
            const reviews = tips.flatMap(tip => tip.reviews);
            const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;
            return {
                status: 200,
                message: 'Performance data retrieved successfully',
                performance: {
                    totalEarnings,
                    numberOfTips,
                    averageRating
                }
            };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async comparePerformance(user_id, period) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            const now = new Date();
            let currentPeriodTips, previousPeriodTips;
            switch (period) {
                case 'weekly':
                    const weekAgo = new Date(now.setDate(now.getDate() - 7));
                    const twoWeeksAgo = new Date(now.setDate(now.getDate() - 14));
                    currentPeriodTips = employee.tips.filter(tip => tip.date >= weekAgo);
                    previousPeriodTips = employee.tips.filter(tip => tip.date >= twoWeeksAgo && tip.date < weekAgo);
                    break;
                case 'monthly':
                    const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                    const twoMonthsAgo = new Date(now.setMonth(now.getMonth() - 2));
                    currentPeriodTips = employee.tips.filter(tip => tip.date >= monthAgo);
                    previousPeriodTips = employee.tips.filter(tip => tip.date >= twoMonthsAgo && tip.date < monthAgo);
                    break;
                default:
                    return { status: 400, message: 'Invalid period' };
            }
            const currentTotalEarnings = currentPeriodTips.reduce((sum, tip) => sum + tip.amount, 0);
            const previousTotalEarnings = previousPeriodTips.reduce((sum, tip) => sum + tip.amount, 0);
            const currentNumberOfTips = currentPeriodTips.length;
            const previousNumberOfTips = previousPeriodTips.length;
            const currentReviews = currentPeriodTips.flatMap(tip => tip.reviews);
            const previousReviews = previousPeriodTips.flatMap(tip => tip.reviews);
            const currentAverageRating = currentReviews.reduce((sum, review) => sum + review.rating, 0) / currentReviews.length || 0;
            const previousAverageRating = previousReviews.reduce((sum, review) => sum + review.rating, 0) / previousReviews.length || 0;
            return {
                status: 200,
                message: 'Performance comparison data retrieved successfully',
                comparison: {
                    current: {
                        totalEarnings: currentTotalEarnings,
                        numberOfTips: currentNumberOfTips,
                        averageRating: currentAverageRating
                    },
                    previous: {
                        totalEarnings: previousTotalEarnings,
                        numberOfTips: previousNumberOfTips,
                        averageRating: previousAverageRating
                    }
                }
            };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default PerformanceService;