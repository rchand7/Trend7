import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        // Check for token in cookies
        const token = req.cookies.token;
        
        // If token is missing, return an error response
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        // If token is invalid (or verification fails), return an error response
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        // Store userId in the request object for further use in the next middleware or route handler
        req.id = decoded.userId;

        // Call next() to move to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication Error: ", error);

        // Return a 500 Internal Server Error response in case of any issues during token verification
        return res.status(500).json({
            message: "Something went wrong during authentication",
            success: false,
        });
    }
};

export default isAuthenticated;
