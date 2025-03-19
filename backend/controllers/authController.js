const User = require('../models/User');
const { generateToken } = require('../config/jwt');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        const user = new User({ name, email, password, role });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findUser({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = generateToken(user);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};