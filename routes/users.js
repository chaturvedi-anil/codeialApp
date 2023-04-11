const express= require('express');
const router=express.Router();
const usersController= require('../controllers/users_controller');

//user profile
router.get('/profile', usersController.userProfile); 

// signin process /users/signIn
router.get('/signIn', usersController.signIn);
router.post('/create', usersController.createUser);

//signUp process
router.get('/signUp', usersController.signUp);
router.post('/create-session', usersController.createSession);

// Logout
router.get('/logOut', usersController.logOut);
module.exports = router;