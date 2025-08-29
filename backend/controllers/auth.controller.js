import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

export const signup = async (req,res) =>{
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error( 'All fields are required' );
        }
        
        const userAlreadyExists = await User.findOne({ email });
        
        if (userAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hasedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hasedPassword,
            name,
            verificationToken,
            verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        //save the user to the database
        await user.save();

        //jwt
        generateTokenAndSetCookie( res, user._id);

        res.status(201).json({ success: true, message: 'User created successfully',
            user:{
            ...user._doc,
            password: undefined,
        }, });
    
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }   
}
export const login = async (req,res) =>{
    res.send("login route");
}
export const logout = async (req,res) =>{
    res.send("Logout route");
}