import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import axios from "axios";

export default function SignUpForm({ onSwitchToLogin, onSuccess }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [location, setLocation] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const debounceTimeout = useRef();

	useEffect(() => {
		if (location.trim().length < 1) {
			setSuggestions([]);
			return;
		}

		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(() => {
			setLoading(true);
			axios
				.get("https://nominatim.openstreetmap.org/search", {
					params: {
						q: location,
						format: "json",
						addressdetails: 1,
						limit: 5,
						countrycodes: "de",
					},
				})
				.then((res) => setSuggestions(res.data))
				.catch(() => setSuggestions([]))
				.finally(() => setLoading(false));
		}, 300);
	}, [location]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			await api.post("/auth/signup", {
				name,
				email,
				password,
				location,
			});
			onSuccess();
		} catch (err) {
			setError(err.response?.data?.message || "Sign up failed");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				placeholder="Username"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="w-full px-4 py-3 rounded-md bg-white text-black text-sm outline-none focus:ring-2 focus:ring-[#60a5fa]"
				required
			/>
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
			<input
				type="password"
				placeholder="Confirm Password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				className="w-full px-4 py-3 rounded-md bg-white text-black text-sm outline-none focus:ring-2 focus:ring-[#60a5fa]"
				required
			/>
			<div className="relative">
				<input
					type="text"
					placeholder="Location"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					className="w-full px-4 py-3 rounded-md bg-white text-black text-sm outline-none focus:ring-2 focus:ring-[#60a5fa]"
					required
				/>
				{location.length > 1 && (
					<ul className="absolute z-10 bg-white text-black rounded shadow w-full mt-1 max-h-48 overflow-y-auto text-sm">
						{loading && (
							<li className="text-xs text-gray-400 px-4 py-2">
								Searching...
							</li>
						)}
						{suggestions.map((item) => (
							<li
								key={item.place_id}
								onClick={() => {
									setLocation(item.display_name);
									setSuggestions([]);
								}}
								className="px-4 text-xs py-2 cursor-pointer hover:bg-gray-200"
							>
								{item.display_name}
							</li>
						))}
					</ul>
				)}
			</div>

			{error && <p className="text-red-400 text-xs">{error}</p>}

			<button
				type="submit"
				className="bg-blue-400 hover:bg-[#409de5] w-full py-3 rounded font-semibold cursor-pointer uppercase text-sm"
			>
				Sign Up
			</button>
		</form>
	);
}
