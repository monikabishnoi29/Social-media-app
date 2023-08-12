import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {//Asynchronous bcz we're going to be calling mongo database, when we make a call to mngo db that's going to be asynchronous so it's essentially like an API call that we do from front end to backend then backend to database..........req, res: so this will provide us with the rec request body that we get from the frontend and the response is what we are going to be sending back to the frontend but in express provide this by default
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const salt = await bcrypt.genSalt();//basically encryption
        const passwordHash = await bcrypt.hash(password, salt); // encryption our password so that the password is not exposed

        const newUser = new User({//save password to login match again
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();//in this case we are sending back the exact save user in the correct format and the frontend will also use the same format as well
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/** LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });//we use mondoose to try to find the one that has the specified email and i'll bring back all the user information
        if (!user) return res.status(400).json({ msg: "User does not exist. "});
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. "});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};