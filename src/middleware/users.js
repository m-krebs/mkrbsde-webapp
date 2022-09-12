const jwt = require('jsonwebtoken');

module.exports = {
    validateRegistration: (req, res, next) => {
        // username at least 3
        if (!req.body.username || req.body.username.length <3) {
            return res.status(400).send({
                msg: 'Username must be at least 3 chars'
            });
        }
        // password at least 10
        if (!req.body.password || req.body.password.length < 10) {
            return res.status(400).send({
                msg: 'Password must be at least 10 chars'
            });
        }

        // password (repeat) does not match
        if (!req.body.password || req.body.password != req.body.password_repeat) {
            return res.status(400).send({msg: 'Both password must match'});
        }

        next();
    },
    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, 'SECRETKEY');
            req.userData = decoded;
            next();
        } catch (error) {
            return res.status(401).send({
                msg: 'Your session is not valid!'
            });
        }
    }
}