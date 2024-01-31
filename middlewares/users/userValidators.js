const { check, validationResult } = require("express-validator");

const User = require('../../models/user');

module.exports = {
    addUsersValidators: [
        check("firstname")
            .isLength({ min: 1 })
            .withMessage("First name is required")
            .isAlpha("en-US", { ignore: " -" })
            .withMessage("Name must not contain anything other than alphabet")
            .trim(),
        check("lastname")
            .isLength({ min: 1 })
            .withMessage("Last name is required")
            .isAlpha("en-US", { ignore: " -" })
            .withMessage("Name must not contain anything other than alphabet")
            .trim(),
        check("email")
            .isEmail()
            .withMessage("Invalid email address")
            .trim()
            .custom(async (value) => {
                try {
                    const user = await User.findOne({ email: value });
                    if (user) {
                        throw new Error("Email already in use!");
                    }
                } catch (e) {
                    throw new Error(e.message);
                }
            }),
        check("password")
            .notEmpty()
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
    ],
    loginUsersValidators: [
        check("email")
            .isEmail()
            .withMessage("Invalid email address")
            .trim(),
        check("password")
            .notEmpty()
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
    ],
    usersValidationHandler: function (req, res, next) {
        const errors = validationResult(req);
        const mappedErrors = errors.mapped();

        if (Object.keys(mappedErrors).length === 0) {
            next();
        } else {
            // response the errors
            return res.status(500).json({
                errors: mappedErrors,
            })
        }
    }
};
