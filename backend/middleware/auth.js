import jwt from "jsonwebtoken";


const ensureAuth = (req, res, next) => {
    const authheader = req.headers.authorization;
    if (!authheader) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const decoded = jwt.verify(authheader, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = { ensureAuth };