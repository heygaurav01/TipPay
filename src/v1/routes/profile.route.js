import express from 'express';
import ProfileController from '../controller/profile.controller.js';

const router = express.Router();
const profileController = new ProfileController();

router.post('/create', profileController.createProfile);
router.put('/update', profileController.updateProfile);
router.put('/update-bank', profileController.updateBankDetails);
router.put('/link-wallet', profileController.linkWallet);

export default router;