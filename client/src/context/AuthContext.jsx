import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (token) {
			axios
				.get("http://localhost:4000/api/auth/me", {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => setUser(res.data))
				.catch(() => localStorage.removeItem("token"))
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	const login = (token) => {
		localStorage.setItem("token", token);
		axios
			.get("http://localhost:4000/api/auth/me", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setUser(res.data));
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	const deleteAccount = async () => {
		const confirmDelete = confirm(
			"Are you sure you want to delete your account?"
		);
		if (!confirmDelete) return;

		try {
			await axios.delete("http://localhost:4000/api/auth", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			localStorage.removeItem("token");
			setUser(null);
			window.location.href = "/";
		} catch (err) {
			console.error("Failed to delete account:", err);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				login,
				token,
				logout,
				loading,
				deleteAccount,
				updateUser: (newData) =>
					setUser((prev) => ({ ...prev, ...newData })),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
