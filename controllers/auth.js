const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Blacklist = require('../models/blacklist');

module.exports = {
    register: async function (req, res) {
        const { firstname, lastname, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                firstname,
                lastname,
                email,
                password: hashedPassword,
            });

            const savedUser = await newUser.save();
            const {password: savedPassword, ...userData} = savedUser._doc;
            return res.status(200).json({
                status: 'success',
                code: 200,
                data: {
                    user: userData,
                },
                message: 'User was added successfully!',
            });
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                errors: {
                    status: 'server error',
                    code: 500,
                    data: {},
                    message: 'Internal server error',
                },
            });
        }
    },
    login: async function (req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    errors: {
                        status: 'unauthenticated',
                        code: 401,
                        data: {},
                        message: 'Invalid email or password'
                    },
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    errors: {
                        status: 'unauthenticated',
                        code: 401,
                        data: {},
                        message: 'Invalid email or password',
                    },
                });
            }

            const {password: _, ...userData} = user._doc;

            // generate token
            const token = jwt.sign({
                firstname: userData.firstname,
                lastname: userData.lastname,
                id: userData._id,
            }, process.env.JWT_TOKEN, {
                expiresIn: '1h',
            });

            const options = {
                maxAge: 60 * 60 * 1000, // 1h
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            };

            res.cookie('SessionID', token, options);
            return res.status(200).json({
                status: 'success',
                code: 200,
                data: {
                    "access_token": token,
                    user: userData,
                },
                message: 'You have successfully logged in!',
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 'server error',
                    code: 500,
                    data: {},
                    message: 'Internal server error',
                },
            });
        }
    },
    logout: async function (req, res) {
        try {
            const authHeader = req.headers['cookie'];
            if (!authHeader) {
                return res.status(204).json({
                    errors: {
                        status: 'no content',
                        code: 204,
                        data: {},
                        message: 'No cookie found in headers!',
                    }
                });
            }
            const cookie = authHeader.split('=')[1];
            const accessToken = cookie.split(';')[0];
            const checkBlacklisted = await Blacklist.findOne({ token: accessToken });
            if (checkBlacklisted) {
                return res.status(204).json({
                    errors: {
                        status: 'no content',
                        code: 204,
                        data: {},
                        message: 'Blacklisted cookie!',
                    }
                });
            }
            const newBlacklist = new Blacklist({
                token: accessToken,
            });
            await newBlacklist.save();
            res.setHeader('Clear-Site-Data', 'cookies');

            return res.status(200).json({
                status: 'success',
                code: 200,
                data: {},
                message: 'You are successfully logged out!',
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 'server error',
                    code: 500,
                    data: {},
                    message: 'Internal server error',
                },
            });
        }
    },
}
