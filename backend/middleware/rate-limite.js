const rateLimite = require("express-rate-limit");

exports.loginAccountLimiter = rateLimite ({
    windowMs : 15 * 60 * 1000,
    max : 3,
    standardHeaders: true,
    legacyHeaders: false,
});