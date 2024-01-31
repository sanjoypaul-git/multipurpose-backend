const express = require('express');
const { addUsersValidators, loginUsersValidators, usersValidationHandler } = require('../middlewares/users/userValidators');
const { register, login } = require('../controllers/auth');

const router = express.Router();

router.post(
    '/register',
    addUsersValidators,
    usersValidationHandler,
    register
);

router.post(
    '/login',
    loginUsersValidators,
    usersValidationHandler,
    login
);

module.exports = router;
