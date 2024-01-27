const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const { connectDB } = require('./configs/db.config');
const userRouter = require('./routes/userRoute');

// express app
const app = express();

dotenv.config();

// configure header information
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // parse cookies

// connect to the database
connectDB();

// routes
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to multipurpose-db',
    });
});

app.use('/api/v1/auth', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({
        status: 404,
        message: "No such route exists",
    });
});

// default error handler
app.use(function (err, req, res, next) {
    res.status(err.status).json({
        status: err.status,
        message: err.message,
    });
});

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
