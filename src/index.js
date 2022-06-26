const express = require('express');
const app = express();
const port = 3000;

const path = require('path');
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

app.get('/', (req, res) => {
    res.render('index.pug')
});

app.get('/login', (req, res) => {
    res.render('login.pug')
});

app.get('/home', (req, res)=> {
    res.redirect('/abc')
});

app.get('*', (req, res) => {
    res.sendStatus(404);
});

app.set('view engine', 'pug');

app.listen(port, () => {
    console.log(`You can do it!!! Listening port ${port}!`)
});