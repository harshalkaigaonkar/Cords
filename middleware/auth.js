const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    // get token from header
    const token = req.header("x-auth-token");

    if (!token) {
        res.status(401).json({ msg: "no token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(400).json("Server Error");
    }
};