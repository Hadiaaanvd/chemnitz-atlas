// src/components/ChangePasswordForm.jsx
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import api from "../utils/api";

export default function ChangePassword() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handlePasswordUpdate = async () => {
		setMessage("");
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			await api.put("/auth/update-password", { password }); // ✅ uses shared baseURL + token
			setMessage("Password updated successfully.");
			setPassword("");
			setConfirmPassword("");
		} catch (err) {
			setError(
				err.response?.data?.message || "Failed to update password."
			);
		}
	};
	return (
		<div className="w-lg h-full p-8 mx-auto rounded-xl shadow text-white space-y-6">
			<div className="flex flex-col items-center mb-6">
				<FaUserCircle className="text-5xl text-white mb-2" />
				<h2 className="text-lg font-semibold">Change Password</h2>
				<div className="text-sm text-gray-400">
					Update your profile information
				</div>
			</div>
			<div className="space-y-6 ">
				<div>
					<input
						type="password"
						placeholder="New Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-3 rounded bg-white text-black text-xs outline-none focus:ring-2 focus:ring-blue-400"
					/>
				</div>

				<div>
					<input
						type="password"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full px-4 py-3 rounded bg-white text-black text-xs outline-none focus:ring-2 focus:ring-blue-400"
					/>
				</div>

				<button
					onClick={handlePasswordUpdate}
					className="bg-blue-500 cursor-pointer hover:bg-blue-600 w-full py-3 rounded font-semibold uppercase text-sm"
				>
					Update Password
				</button>

				{message && (
					<p className="text-green-400 text-xs -mt-2">{message}</p>
				)}
				{error && <p className="text-red-400 text-xs -mt-2">{error}</p>}
			</div>
		</div>
	);
}
