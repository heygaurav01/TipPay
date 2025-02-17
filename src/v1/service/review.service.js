import Employee from '../model/Employee.model.js';

class ReviewService {
    async addReview(data) {
        try {
            const { user_id, tip_id, rating, comment, customerName } = data;
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            const tip = employee.tips.id(tip_id);
            if (!tip) {
                return { status: 404, message: 'Tip not found' };
            }
            const review = { rating, comment, customerName };
            tip.reviews.push(review);
            await employee.save();
            return { status: 201, message: 'Review added successfully', review };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async getReviews(user_id, tip_id) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            const tip = employee.tips.id(tip_id);
            if (!tip) {
                return { status: 404, message: 'Tip not found' };
            }
            return { status: 200, message: 'Reviews retrieved successfully', reviews: tip.reviews };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    async getReviewSummary(user_id) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            const reviews = employee.tips.flatMap(tip => tip.reviews);
            const totalReviews = reviews.length;
            const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
            const positiveReviews = reviews.filter(review => review.rating >= 4);
            const negativeReviews = reviews.filter(review => review.rating <= 2);
            return {
                status: 200,
                message: 'Review summary retrieved successfully',
                summary: {
                    totalReviews,
                    averageRating,
                    positiveReviews,
                    negativeReviews
                }
            };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default ReviewService;