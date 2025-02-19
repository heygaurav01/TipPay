import express from "express";
import EmployerController from "../controller/employer.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/authorize-payout", authMiddleware, EmployerController.authorizePayout);
router.post("/notify-low-performance", authMiddleware, EmployerController.notifyLowPerformance);
router.post("/notify-payment-issue", authMiddleware, EmployerController.notifyPaymentIssue);
router.post("/notify-system-update", authMiddleware, EmployerController.notifySystemUpdate);
router.post("/notify-compliance", authMiddleware, EmployerController.notifyComplianceRequirement);

export default (app) => {
    app.use("/api/v1/employers", router);
};
