import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificatonEmail, sendWelcomeEmail } from '../mail/email.js';

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

        await sendVerificatonEmail(user.email, verificationToken)

        res.status(201).json({ success: true, message: 'User created successfully',
            user:{
            ...user._doc,
            password: undefined,
        }, });
    
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }   
}
export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationExpiresAt: { $gt: Date.now() } // Check if the token is still valid
        })
        if(!user){
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success:true,
            message:"Email verified successfully",
            user:{
                ...user._doc,
                password:undefined
            },
        })
    } catch (error) {
        console.log("Error in verify Email",error)
        res.status(400).json({success:false, message:"server error"})
    }
}

export const login = async (req,res) =>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email user not found' });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid password try again!!!' });
        }
        
        generateTokenAndSetCookie(res, user._id);

        user.lastlogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                ...user._doc,
                password: undefined, // Exclude password from response
            },
        });
    
    } catch (error) {
        console.log("you have error in login", error);
        res.status(400).json({ success: false, message: error.message });
    }
}
export const logout = async (req,res) =>{
    res.clearCookie("token");
   res.status(200).json({success:true, message:"logout successful"});
}
export const forgetPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 1 * 60 * 60 * 1000; 
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiration;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: 'Password reset email sent successfully' });

    } catch (error) {
        console.log("Error in forget password", error);
        res.status(400).json({ success: false, message: error.message });
    }

}
export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() } // Check if the token
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
        }

        const hasedPassword = await bcryptjs.hash(password, 10);

        user.password = hasedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: 'Password reset successfully' });
        } catch (error) {
        console.log("Error in reset password", error);
        res.status(400).json({ success: false, message: error.message });
}
}