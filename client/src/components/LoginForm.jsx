import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"http://localhost:4000/api/auth/login",
				{
					email,
					password,
				}
			);
			login(res.data.token);
		} catch (err) {
			setError("Login failed");
		}
	};

	return (
		<form onSubmit={handleLogin} className="space-y-4 ">
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="w-full px-4 py-3 rounded-md bg-white text-black text-sm outline-none focus:ring-2 focus:ring-[#60a5fa]"
				required
			/>

			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="w-full px-4 py-3 rounded-md bg-white text-black text-sm outline-none focus:ring-2 focus:ring-[#60a5fa]"
				required
			/>

			{error && <p className="text-red-400 text-xs">{error}</p>}

			<button
				type="submit"
				className="bg-blue-400 hover:bg-[#409de5] w-full py-3 rounded font-semibold cursor-pointer uppercase text-sm"
			>
				Login
			</button>
		</form>
	);
}
