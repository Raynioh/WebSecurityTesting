import { Router } from 'express';
import { User } from '../models/user';
import { loadUserGoodPasswords, loadUserSafe } from '../database';
import { readFileSync } from 'fs';
import path from 'path';
import { rootPath } from 'get-root-path';

const router = Router();
const filesPath: string = path.join(rootPath, 'dist/public/files/');

router.get('/', async (req, res) => {
    res.render('login');
});

router.post('/verticalAttack', async (req, res) => {
    var username: string = req.body.username;
    
    var passwords: string[] = [];
    try {
        let data = readFileSync(filesPath + '10k-most-common.txt', 'utf8');
        passwords = data.split("\n");
    } catch (err) {
        console.error(err);
    }

    var maxLoginAttempts;
    var user: User | undefined;
    if(req.body.vulnerable) {
        maxLoginAttempts = passwords.length;
        user = await loadUserSafe(username);
    } else {
        maxLoginAttempts = 5;
        user = await loadUserGoodPasswords(username);
    }
    
    var tried: string[] = [];
    var correct: string | undefined;

    var i = 0;

    while(i < maxLoginAttempts) {
        if(user && user.password == passwords[i]) {
            correct = passwords[i];
            tried.push(passwords[i]);
            break;
        } else {
            tried.push(passwords[i]);
        }
        i++;
    }        

    if(correct) {
        res.render("login", {successful: true, passwords: tried, loginInfo: {username: username, password: correct}});
    } else {
        res.render("login", {unsuccessful: true, passwords: tried});
    }
});

router.post('/horizontalAttack', async (req, res) => {
    var password: string = req.body.password;
    
    var usernames: string[] = [];
    try {
        let data = readFileSync(filesPath + 'most_common_usernames.txt', 'utf8');
        usernames = data.split("\r\n");
    } catch (err) {
        console.error(err);
    }

    var maxLoginAttempts = req.body.vulnerable ? usernames.length : 5;
    var tried: string[] = [];
    let correct = new Map<string, string>();
    var i = 0;
    
    while(i < maxLoginAttempts) {
        var user: User | undefined = req.body.vulnerable ? await loadUserSafe(usernames[i]) : await loadUserGoodPasswords(usernames[i]);
        console.log(user);
        if(user && user.password == password) {
            correct.set(usernames[i], password);
            tried.push(usernames[i]);
        } else {
            tried.push(usernames[i]);
        }
        i++;
    }

    if(correct.size > 0) {
        res.render("login", {successful: true, usernames: tried, loginInfo: correct});
    } else {
        res.render("login", {unsuccessful: true, usernames: tried});
    }
});

router.post('/login', async (req, res) => {
    var vulnerability = req.body.vulnerable;
    var username: string = req.body.username;
    var password: string = req.body.password;

    var user: User | undefined = await loadUserSafe(username);
    if(vulnerability) {
        if(user) {
            if(user.password == password) {
                res.render('login', {successful: true});
            } else {
                res.render('login', {unsuccessful: true, error: "Wrong password"});
            }
        } else {
            res.render('login', {unsuccessful: true, error: "Wrong username"});
        }
    } else {
        if(user) {
            if(user.password == password) {
                res.render('login', {successful: true});
            } else {
                res.render('login', {unsuccessful: true, error: "Wrong username or password"});
            }
        } else {
            res.render('login', {unsuccessful: true, error: "Wrong username or password"});
        }
    }
});

export default router;
