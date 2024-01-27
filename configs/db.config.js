const mongoose = require('mongoose');

module.exports = {
    connectDB: async function () {
        try {
            const conn = await mongoose.connect(`${process.env.DB_URI}/multipurpose-db`);
            console.log(`MongoDB connected: ${conn.connection.host}`);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    }
}
