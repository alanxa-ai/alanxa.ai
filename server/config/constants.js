require('dotenv').config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

module.exports = {
    SERVER_URL,
    CLIENT_URL
};
