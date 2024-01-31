const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Blacklist = require('../models/blacklist');

module.exports = {
    verifyToken: async function (req, res, next) {
        try {
            const authHeader = req.headers['cookie'];

            if (!authHeader) {
                return res.status(401).json({
                    errors: {
                        status: 'unauthorized',
                        code: 401,
                        data: {},
                        message: 'Session has expired. Please login!',
                    }
                });
            }

            const cookie = authHeader.split('=')[1];
            const accessToken = cookie.split(';')[0];
            const checkBlacklisted = await Blacklist.findOne({ token: accessToken });
            if (checkBlacklisted) {
                return res.status(401).json({
                    errors: {
                        status: 'unauthorized',
                        code: 401,
                        data: {},
                        message: 'Session has expired. Please login!',
                    }
                });
            }

            jwt.verify(cookie, process.env.JWT_TOKEN, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        errors: {
                            status: 'unauthorized',
                            code: 401,
                            data: {},
                            message: 'Session has expired. Please login!',
                        }
                    });
                }
                const { id } = decoded;
                const user = await User.findById(id);
                const { password, ...userData } = user._doc;
                req.user = userData;
                next();
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 'server error',
                    code: 500,
                    data: {},
                    message: 'Internal server error!',
                }
            });
        }
    },
    verifyRole: function (req, res, next) {
        try {
            const user = req.user;
            const { role } = user;
            if (role !== 'admin') {
                return res.status(401).json({
                    errors: {
                        status: 'unauthorized',
                        code: 401,
                        data: {},
                        message: 'You are not authorized to view the page!',
                    }
                });
            }
            next();
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 'server error',
                    code: 500,
                    data: {},
                    message: 'Internal server error!',
                }
            });
        }
    },
}
