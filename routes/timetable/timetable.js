const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn} = require('../middlewares');
const User = require('../../models/user');
const Course = require('../../models/course');
const CourseSchedule = require('../../models/course_schedule');
const router = express.Router();
const path = require('path'); // 현재 프로젝트의 경로
const { Mongoose } = require('mongoose');


var timeList = new Array();


function courseDay(day) {
    switch(day) {
        case 'mon':
            return "월요일";
        case 'tue':
            return "화요일";
        case 'wed':
            return "수요일";
        case 'thu':
            return "목요일";
        case 'fri':
            return "금요일";
    }
}

function courseType(type) { //과목 타입(online_realtime,online_video,offline)
    switch (type) {
        case 'online_realtime':
            return '온라인 실시간';
        case 'online_video':
            return '온라인 동영상';
        case 'offline': //오프라인이면 강의실을 리턴
            return '오프라인';
    }
}

function getCurrentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}

router.get('/main', isLoggedIn, async (req, res, next) => {
    console.log('시간표 메인');
    try {
        res.render(path.join(__dirname, '../../views/timetable/timetable_main.ejs' ), {
            title: '내 시간표',
        });
    }
    catch (err) {
        console.error('/views/timetable/timetable.js 에서 에러');
        console.error(err);
        next(err);
    }
});

router.get('/edit', isLoggedIn, async (req, res, next) => {
    console.log('시간표 관리');
    try {
        res.render(path.join(__dirname, '../../views/timetable/timetable_edit.ejs' ), {
            title: '시간표 관리',
        });
    }
    catch (err) {
        console.error('/views/timetable/timetable.js 에서 에러');
        console.error(err);
        next(err);
    }
});





router.post('/course/time/add', isLoggedIn, async (req, res, next) => {
    console.log(req.body);
    const { type, day, stime, etime, classroom, btnid, pid } = req.body;
    try {
        var time = {
            type : type,
            day : day, //mon, tue, ... 저장
            stime : stime, //시작시간
            etime : etime, //종료시간
            classroom : classroom, // 링크or강의실
            btnid : btnid, // 삭제버튼의 id
            pid : pid
        }
        timeList.push(time); // 시간 추가

        var returnTime = {
            type : courseType(type),
            day : courseDay(day),
            stime :stime,
            etime:etime,
        }
        res.send(returnTime); // 추가된 시간 출력용으로 전달
    } catch(err) {
        return (err);
    }
});


router.post('/course/time/delete', isLoggedIn, async (req, res) => {
    console.log(req.body);
    var targetid = req.body.target;
    try {
        const index = timeList.findIndex(function(item) {
            return item.btnid === targetid
        });
        var del = {
            btnid : timeList[index].btnid,
            pid : timeList[index].pid
        }
        timeList.splice(index, 1); // index번째의 시간 1개 삭제
        res.send(del); //삭제될 태그들의 id 리턴
        
    } catch(err) {
        return (err);
    }
});



router.post('/course/add', isLoggedIn, async (req, res, next) => {
    console.log(req.body);
    const {name, professor} = req.body;

    try {
        // 과목 중복 확인
        // const extimetable = await User.findOne( { email: req.user.email}, {courses: 1}); 
        // if (extimetable에 name이 있는 경우) {
        //     console.log('이미 추가한 과목입니다.');
        //     return res.redirect('/course/add?error=exist');
        // }

        // mongoDB에 과목 시간 추가
        var courseIdList = new Array();
        for (var i=0; i < timeList.length; i++) {
            console.log('시간저장 :'+i);
            var courseSchedule = await CourseSchedule.create({
                day : timeList[i].day,
                start_time : timeList[i].stime,
                end_time : timeList[i].etime,
                course_type : timeList[i].type,
                classroom : timeList[i].classroom
            });
            courseIdList.push(courseSchedule._id); // course_id 넣기 (과목 1개의 mongodb id값)
        }
        console.info(courseIdList);

        console.log('user:'+req.user._id);

        // mongoDB에 과목 추가
        const course = await Course.create({ 
            user_id : req.user._id, // 해당 과목의 사용자 obj_id (email 아님! mongodb id값임!)
            course_name : name,
            professor_name : professor,
            schedules : courseIdList, // 과목 시간 리스트
            createdAt : getCurrentDate(), // 과목 추가 날짜
        });

        // user한테도 courses 칼럼에 과목 넣어주기 (이건 불러올때 populate 하면됨)

        
        res.send(course);
        
    } catch (err) {
        next(err);
    }

});

module.exports = router;