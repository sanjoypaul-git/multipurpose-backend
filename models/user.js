const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            trim: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: 'user',
        }
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);

module.exports = User;
