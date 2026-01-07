import jwt from "jsonwebtoken";

// Optional authentication - doesn't fail if no token, but extracts user ID if token exists
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            try {
                const decode = await jwt.verify(token, process.env.SECRET_KEY);
                if (decode && decode.userId) {
                    req.id = decode.userId;
                }
            } catch (error) {
                // Invalid token, but continue without authentication
                console.log("Optional auth: Invalid token, continuing without user ID");
            }
        }
        next();
    } catch (error) {
        // Continue even if there's an error
        next();
    }
};

export default optionalAuth;

