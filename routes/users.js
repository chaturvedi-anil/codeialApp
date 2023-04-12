const express= require('express');
const router=express.Router();
const passport=require('passport');

const usersController= require('../controllers/users_controller');

//user profile
router.get('/profile', usersController.userProfile); 
// signin process /users/signIn
router.get('/signIn', usersController.signIn);
//signUp process
router.get('/signUp', usersController.signUp);
// logout
router.get('/logOut', usersController.logOut);

router.post('/create', usersController.createUser);

// use passport as middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signIn'}
),usersController.createSession);


module.exports = router;