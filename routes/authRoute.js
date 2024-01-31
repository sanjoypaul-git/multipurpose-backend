const express = require('express');
const { addUsersValidators, loginUsersValidators, usersValidationHandler } = require('../middlewares/users/userValidators');
const { register, login } = require('../controllers/auth');

const router = express.Router();

/**
 * @route POST api/v1/auth/register
 * @desc register a user
 * @access public
 */
router.post(
    '/register',
    addUsersValidators,
    usersValidationHandler,
    register
);

/**
 * @route POST api/v1/auth/login
 * @desc login a user
 * @access public
 */
router.post(
    '/login',
    loginUsersValidators,
    usersValidationHandler,
    login
);

module.exports = router;
