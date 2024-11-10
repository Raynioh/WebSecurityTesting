import { Router } from 'express';
import { selectAllUsers, selectAllUsersGoodPasswords } from '../database';
import { User } from '../models/user';

const router = Router();

router.get('/', async (req, res) => {
    var users: User[] | undefined = await selectAllUsers();
    var goodUsers: User[] | undefined = await selectAllUsersGoodPasswords();

    res.render('database', {users, goodUsers});
});

export default router;
