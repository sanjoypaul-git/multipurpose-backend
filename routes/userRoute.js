const express = require('express');
const { addUsersValidators, loginUsersValidators, addUsersValidationHandler } = require('../middlewares/users/userValidators');
const { register, login } = require('../controllers/auth');

const router = express.Router();

router.post(
    '/register',
    addUsersValidators,
    addUsersValidationHandler,
    register
);

router.post(
    '/login',
    loginUsersValidators,
    addUsersValidationHandler,
    login
);

module.exports = router;
