const express = require("express");
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const router = express.Router();

// router.get('/', (req, res) => res.render('index'));
// router.get('/login', (req, res) => res.render("login", {page:"login"}));
// router.get('/signup', (req, res) => res.render("signup", {page:"signup"}));
// router.get('/signup_agree', (req, res) => res.render("signup_agree", {page:"signup_agree"}));

module.exports = router;
const path = require('path'); // 현재 프로젝트의 경로

const User = require('../models/user');
const mongoose = require('mongoose');


router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});



// 메인
router.get('/', isLoggedIn, (req, res) => { // app.get('주소', 라우터) : GET 요청이 올때 할 동작
    try {
        // res.send('Hello, Express'); // 테스트용
        res.render(path.join(__dirname, '../views/mainframe.ejs' ), {
            title: 'StudyTight 메인화면',
        });
    }
    catch (err) {
        console.error('routes/index.js 에서 에러');
        console.error(err);
        next(err);
    }
});

router.get('/', isNotLoggedIn, (req, res) => {
    try {
        // res.send('Hello, Express'); // 테스트용
        res.render(path.join(__dirname, '../views/login.ejs' ), {
            title: 'StudyTight 메인화면',
        });
    }
    catch (err) {
        console.error('routes/index.js 에서 에러');
        console.error(err);
        next(err);
    }
})

