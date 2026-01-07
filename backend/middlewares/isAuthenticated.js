import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        if (!token) {
            // Set CORS headers even for error responses
            res.setHeader('Access-Control-Allow-Origin', frontendUrl);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            // Set CORS headers even for error responses
            res.setHeader('Access-Control-Allow-Origin', frontendUrl);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        // Set CORS headers even for error responses
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.setHeader('Access-Control-Allow-Origin', frontendUrl);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}
export default isAuthenticated;