const express = require('express');
const app = express();
const mysql = require('mysql');

const session = require('express-session');

// Port of Server
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static')));

// add routes
const router = require('./src/routes/router.js');
app.use('/', router);

const livereload = require("livereload")
const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, 'public'))
const connectLivereload = require("connect-livereload")

app.use(connectLivereload())

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'pug');

app.listen(port, () => {
    console.log(`Server is running and listening at port ${port}`)
});