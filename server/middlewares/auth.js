import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ message: "Unauthorized" });

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (!user || user.isDeleted)
			return res.status(404).json({ message: "User not found" });

		req.user = user; // Inject user into request
		next();
	} catch (err) {
		res.status(401).json({ message: "Invalid token" });
	}
};
