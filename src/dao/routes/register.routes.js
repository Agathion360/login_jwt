import { Router } from 'express';
import RegisterController from '../controllers/register.controller.js';

const router = Router();
const registerController = new RegisterController();

router.post('/register', registerController.registerUser);

export default router;
