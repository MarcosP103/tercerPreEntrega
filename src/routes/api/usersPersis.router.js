import { Router } from 'express';
import {
    getAllUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser
} from '../../controllers/userPersis.controller.js';

const router = Router();

router.get('/users', getAllUsers);

router.post('/users', addUser);

router.get('/users/:id', getUserById);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

export default router;
