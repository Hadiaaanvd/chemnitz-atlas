import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { authMiddleware } from "../middlewares/auth.js";
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup

router.post("/signup", async (req, res) => {
	const { email, password, name, location } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		if (existingUser && !existingUser.isDeleted) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashed = await bcrypt.hash(password, 10);

		let user;

		if (existingUser && existingUser.isDeleted) {
			// Revive the soft-deleted user
			existingUser.password = hashed;
			existingUser.name = name;
			existingUser.location = location;
			existingUser.isDeleted = false;
			await existingUser.save();
			user = existingUser;
		} else {
			// New user registration
			user = await User.create({
				email,
				password: hashed,
				name,
				location,
			});
		}

		const token = jwt.sign({ id: user._id }, JWT_SECRET, {
			expiresIn: "1d",
		});

		res.json({ token });
	} catch (err) {
		console.error("Signup error:", err.message);
		res.status(500).json({ message: "Server error during signup." });
	}
});

// Login
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) return res.status(400).json({ message: "Invalid credentials" });

	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.status(400).json({ message: "Invalid credentials" });

	const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
	res.json({ token });
});

// /me
router.get("/me", authMiddleware, async (req, res) => {
	res.json(req.user);
});

router.put("/update", authMiddleware, async (req, res) => {
	const user = req.user;

	const allowedFields = ["name", "location"];
	for (let key of allowedFields) {
		if (req.body[key] !== undefined) {
			user[key] = req.body[key];
		}
	}
	await user.save();

	res.json({
		message: "Profile updated",
		user: { name: user.name, location: user.location },
	});
});

router.put("/update-password", authMiddleware, async (req, res) => {
	const { password } = req.body;

	if (!password || password.length < 6)
		return res
			.status(400)
			.json({ message: "Password must be at least 6 characters" });

	const user = req.user;
	const hashed = await bcrypt.hash(password, 10);
	user.password = hashed;
	await user.save();

	res.json({ message: "Password updated successfully" });
});

router.delete("/", authMiddleware, async (req, res) => {
	const user = req.user;
	user.isDeleted = true;
	await user.save();
	res.json({ message: "User account marked as deleted" });
});

router.post("/:id/favorite", authMiddleware, async (req, res) => {
	const user = req.user;
	const placeId = req.params.id;

	if (user.favorites.includes(placeId)) {
		user.favorites.pull(placeId);
		await user.save();
		return res.json({ message: "Removed from favorites" });
	}

	user.favorites.push(placeId);
	await user.save();
	res.json({ message: "Added to favorites" });
});

router.get("/favorites", authMiddleware, async (req, res) => {
	const user = await User.findById(req.user._id).populate("favorites");
	res.json(user.favorites);
});

export default router;
