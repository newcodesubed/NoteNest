import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Token
    })

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return token;
}