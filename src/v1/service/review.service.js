import Employee from '../model/Employee.model.js';

class ReviewService {
    // 🚀 Add a new review
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
            const review = { rating, comment, customerName, flagged: false, reports: [] }; // Added new fields
            tip.reviews.push(review);
            await employee.save();
            return { status: 201, message: 'Review added successfully', review };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    // 🚀 Get reviews for a tip
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

    // 🚀 Get review summary for an employee
    async getReviewSummary(user_id) {
        try {
            const employee = await Employee.findById(user_id);
            if (!employee) {
                return { status: 404, message: 'Employee not found' };
            }
            const reviews = employee.tips.flatMap(tip => tip.reviews);
            const totalReviews = reviews.length;
            const averageRating = totalReviews > 0 
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
                : 0;
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

    // 🚀 Flag a review as inappropriate
    async flagReview(reviewId) {
        try {
            const employee = await Employee.findOne({ "tips.reviews._id": reviewId });
            if (!employee) return { status: 404, message: "Review not found" };

            const review = employee.tips.flatMap(tip => tip.reviews).find(r => r._id.toString() === reviewId);
            if (!review) return { status: 404, message: "Review not found" };

            review.flagged = true;
            await employee.save();

            return { status: 200, message: "Review flagged successfully" };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    // 🚀 Report a flagged review
    async reportReview(reviewId, employerId, reason) {
        try {
            const employee = await Employee.findOne({ "tips.reviews._id": reviewId });
            if (!employee) return { status: 404, message: "Review not found" };

            const review = employee.tips.flatMap(tip => tip.reviews).find(r => r._id.toString() === reviewId);
            if (!review) return { status: 404, message: "Review not found" };

            review.reports.push({ employerId, reason });
            await employee.save();

            return { status: 200, message: "Review reported successfully" };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    // 🚀 Get all flagged reviews (For Admins)
    async getFlaggedReviews() {
        try {
            const employees = await Employee.find({ "tips.reviews.flagged": true });
            const flaggedReviews = employees.flatMap(employee => 
                employee.tips.flatMap(tip => tip.reviews.filter(review => review.flagged))
            );

            return { status: 200, flaggedReviews };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }

    // 🚀 Remove a flagged review (Admin Action)
    async removeFlaggedReview(reviewId) {
        try {
            const employee = await Employee.findOne({ "tips.reviews._id": reviewId });
            if (!employee) return { status: 404, message: "Review not found" };

            employee.tips.forEach(tip => {
                tip.reviews = tip.reviews.filter(review => review._id.toString() !== reviewId);
            });

            await employee.save();
            return { status: 200, message: "Flagged review removed successfully" };
        } catch (error) {
            return { status: 500, message: error.message };
        }
    }
}

export default new ReviewService();
