const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./userAuth');

//signup

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, address} = req.body;

        if(username.length < 4){
            return res
            .status(400)
            .json({ message: "Username length should be greater than 3 " });
        }

        //check username already exists
        const existingUsername = await User.findOne({ username:username });
        if (existingUsername) {
            return res
            .status(400)
            .json({ message: "Username already exists" });
        }
        //check email already exists
        const existingEmail = await User.findOne({ email:email });
        if (existingEmail) {
            return res
            .status(400)
            .json({ message: "Email already exists" });
        }


        if(password.length <= 5){
            return res
            .status(400)
            .json({ message: "Password length should be greater than 5 " });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username:username,
            email:email,
            password:hashedPassword,
            address:address
        });

        await newUser.save();
        return res.status(200).json({ message: "User created successfully" });



        
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({username});
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims =
                [
                    { name: existingUser.username },
                    { role: existingUser.role }
                ];
                const token = jwt.sign({ authClaims }, process.env.JWT_SECRET, { expiresIn: '30d' });
                res.status(200)
                .json({ id: existingUser._id, role:existingUser.role, token:token});
            }
            else  {
                res.status(400).json({ message: "Invalid credentials" });
            }   
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
});

//get user information
router.get('/user-information',authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const user = await User.findById(id).select('-password');  
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
});

// Update package
router.put('/update-package', authenticateToken, async (req, res) => {
    console.log('reqBody',req.body)
    try {
        const { id } = req.headers;
        const { package } = req.body;
        await User.findByIdAndUpdate(id, { package: package });
        return res.status(200).json({ message: "Package updated successfully" });
    } catch (error) {
        console.log('error updating package:',error.message)
        res.status(500).json({ message: "Internal server Error" });
    }
});

//update address
router.put('/update-address',authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate
        (id, {address:address});
        return res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
});



module.exports = router;