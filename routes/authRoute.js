const express = require('express');
const { addUsersValidators, loginUsersValidators, usersValidationHandler } = require('../middlewares/users/userValidators');
const { register, login, logout } = require('../controllers/auth');

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

/**
 * @route GET api/v1/auth/logout
 * @desc logout a user
 * @access public
 */
router.get(
    '/logout',
    logout
);

module.exports = router;
