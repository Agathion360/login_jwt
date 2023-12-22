
import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();
const userController = new UserController();

router.get('/', async (req, res) => {
    try {
        const users = await userController.getUsers(); 
        res.status(200).send({ status: 'OK', data: users });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

router.get('/paginated', async (req, res) => {
    try {
        const users = await userController.getUsersPaginated();
        res.status(200).send({ status: 'OK', data: users });
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message });
    }
});

export default router;
