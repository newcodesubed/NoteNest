import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {                                                                                                                                                       
    const token = req.cookies.token;                                                                                                            
    console.log("Token from cookies:", token);
    // Check if token exists                                                                                                                                                                                                                                                    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - No token provided, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
        }
        console.log("Decoded token:", decoded);
        req.userId = decoded.id; 
        console.log("User ID from token:", req.userId);
        next();
    } catch (error) {
        console.log("Error in verifyToken middleware", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}