const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/db.connection.js');
const userMiddleware = require('../middleware/users.js');

router.get('/secret-route', (req, res, next) => {
    res.send('This is the secret content. Only logged in users can see that!');
});

//------
router.get('/', (req, res) => {
    res.render('home/index.pug')
});

router.get('/register', (req, res) => {
    res.render('register/register.pug')
});

router.get('/login', (req, res) => {
    res.render('login/login.pug')
});

router.post('/signup', userMiddleware.validateRegistration, (req, res, next) => {
    db.query(`SELECT *
              FROM users
              WHERE LOWER(username) = LOWER(${db.escape(req.body.username)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'This username is already in use!'
                });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg: err
                        });
                    } else {
                        // has hashed pw => add to database
                        db.query(
                            `INSERT INTO users (username, password, registered)
                             VALUES (${db.escape( //'${uuid.v4()}',
                                     req.body.username
                             )}, ${db.escape(hash)}, now())`,
                            (err, result) => {
                                if (err) {
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }
                                return res.status(201).send({
                                    msg: 'Registered!'
                                });
                            }
                        );
                    }
                });
            }
        }
    );
});

router.post('/login', (req, res, next) => {
    let uname = db.escape(req.body.username);
    db.query(
        `SELECT *
         FROM users
         WHERE username = ${uname};`,
        // `SELECT * FROM users WHERE username = ${req.body.username};`,
        (err, result) => {
            console.log('These are the results: ' + result.toString());
            // user does not exists
            if (err) {
                return res.status(400).send({
                    msg: err
                });
            }
            console.log(result.length);

            if (result.length === 0) {
                return res.status(401).send({
                    msg: 'Username or password is incorrect!'
                });
            }
            console.log(result[0].username);
            console.log(result[0])
            console.log(!result.length);
            // check password
            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    // wrong password
                    if (bErr) {
                        throw bErr;
                        return res.status(401).send({
                            msg: 'Username or password is incorrect!'
                        });
                    }
                    if (bResult) {
                        const token = jwt.sign({
                                username: result[0].username,
                                userId: result[0].id
                            },
                            'SECRETKEY', {
                                expiresIn: '7d'
                            }
                        );
                        db.query(
                            `UPDATE users
                             SET last_login = now()
                             WHERE id = '${result[0].id}'`
                        );
                        return res.redirect('back');
                        return res.status(200).send({
                            msg: 'Logged in!',
                            token,
                            user: result[0]
                        });
                    }
                    return res.status(401).send({
                        msg: 'Username or password is incorrect!'
                    });
                }
            );
        }
    );
});

router.get('/home', (req, res) => {
    res.redirect('/abc')
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});
//------

module.exports = router;