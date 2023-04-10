const express= require('express');
const router=express.Router();
const usersController= require('../controllers/users_controller');

router.post('/create-session', usersController.createSession);
router.post('/create', usersController.createUser);
router.get('/signUp', usersController.signUp);

module.exports = router;