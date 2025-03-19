const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const decoded = verifyToken(token);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            console.log("User not found");
            return res.status(401).json({ msg: "Unauthorized" });
        }
        next();
    } catch (error) {
        console.log("Token verification failed:", error);
        res.status(401).json({ msg: "Token is invalid" });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: "Access denied" });
    next();
};