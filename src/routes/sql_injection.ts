import { Router } from 'express';
import { loadUserSafe, loadUserVulnerable } from '../database';
import { User } from '../models/user';

const router = Router();

router.get('/', async (req, res) => {
    res.render('data');
});

router.post('/data', async (req, res) => {
    var vulnerability = req.body.vulnerable;
    var username: string = req.body.username;

    var user: User | undefined;
    if(vulnerability) {
        user = await loadUserVulnerable(username);
    } else {
        user = await loadUserSafe(username);
    }

    if(user){
        res.render('data', {data: user.data});
    } else {
        res.render('data', {error: "Wrong username"});
    }
});

export default router;
