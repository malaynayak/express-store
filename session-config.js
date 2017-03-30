session = require('express-session');
module.exports = session({
    secret: '2C44-4D44-WppQ38S-E8SL',
    resave: false,
    saveUninitialized: true
});