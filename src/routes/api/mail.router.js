import express from 'express';
import { sendMail } from '../../controllers/mail.controller.js';

const router = express.Router();

router.get('/mail', sendMail);

export default router;
