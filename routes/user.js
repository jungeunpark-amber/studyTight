const express = require('express');

// const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('user page. 회원 정보 페이지');
})

// router.post('/:id/', isLoggedIn, async (req, res, next) => {
//   try {
//     const user = await User.findOne({ where: { id: req.user.id } });
//     if (user) {
//       await user.addFollowing(parseInt(req.params.id, 10));
//       res.send('success');
//     } else {
//       res.status(404).send('no user');
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;