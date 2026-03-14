require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 8083;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Event & Booking Service running on port ${PORT}`);
    });
});