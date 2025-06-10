import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now we can access `req.user.userId` in controller

    next(); // move to the next middleware/controller

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default verifyToken;
