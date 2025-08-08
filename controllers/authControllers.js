const User = require("../models/User");
const Leads = require("../models/Leads")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//console.log('Mongoose instance ID:', require('mongoose').instanceId);
// Should be the same across all files

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User Already Exists" });
        }

        console.log("reached here");

        const user = await User.create({ name, email, password, role: 'user' }); // no hashing here

        res.status(201).json({ msg: "User Created Successfully" });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ msg: "Error registering user", error: error.message });
    }
};

exports.lead = async (req, res) => {
    const { name, email, phone, message } = req.body;
    try {
        
        const user = await Leads.create({ name, email, phone, message}); // no hashing here

        res.status(201).json({ msg: "Lead Created Successfully" });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ msg: "Error registering user", error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password); // fixed typo
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
         const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
        //const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

        // res.cookie('userEmail', user.email, {
        //   httpOnly: true, // Prevents JS access (security)
        //   secure: true, // Only sent over HTTPS
        //   sameSite: 'strict', // Prevents CSRF attacks
        //   //maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
        //   //domain: '.yourdomain.com' // Share across subdomains (if needed)
        // });

        res.cookie("token", token, {
          httpOnly: true, // Prevents JS access (security)
          secure: true, // Only sent over HTTPS
          sameSite: 'strict', // Prevents CSRF attacks
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
          //domain: '.yourdomain.com' // Share across subdomains (if needed)
        });

        res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({ msg: "Error logging in", error: error.message });
    }
};

exports.mine = async (req, res) => {
    try {

        const token = req.cookies.token;
        if(!token){
            console.log("No token found");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("User from token:", user);
        res.json({user})

        // const userId = req.user.id; // ✅ Getting from decoded token
    
        // const user = await User.findById(userId).select("name email services payments");
        // if (!user) return res.status(404).json({ message: "User not found" });
    
        // const compliance = await Compliance.find({ userId });
        // const completedCount = compliance.filter(c => c.status === "completed").length;
        // const pendingCount = compliance.filter(c => c.status === "pending").length;
        // const total = compliance.length;
        // const completionRate = total > 0 ? ((completedCount / total) * 100).toFixed(2) : 0;
    
        // res.json({
        //   user: {
        //     name: user.name,
        //     email: user.email,
        //     services: user.services,
        //     payments: user.payments,
        //   },
        //   compliance,
        //   stats: {
        //     total,
        //     completed: completedCount,
        //     pending: pendingCount,
        //     completionRate,
        //   },
        //});
      } catch (error) {
        //console.error("Dashboard Error:", error);
        res.status(401).json({ error: "Invalid token" });
      }
};