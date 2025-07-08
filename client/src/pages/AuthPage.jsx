import { useState } from "react";
import map from "../assets/map-logo.svg";
import logo from "../assets/logo-title.svg";
import title from "../assets/logo-sub.svg";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

export default function AuthPage() {
	const [modeLogin, setModeLogin] = useState(true);
	const [successMessage, setSuccessMessage] = useState("");
	const handleSuccess = () => {
		setModeLogin(true);
		setSuccessMessage("Registration successful! You can now log in.");
		setTimeout(() => setSuccessMessage(""), 4000);
	};

	const handleLogin = () => {
		// ✅ Login success → navigate to homepage
		navigate("/");
	};
	return (
		<div className="min-h-[calc(100vh-97px)] flex items-center justify-center text-white">
			<div className="bg-gradient-to-r from-[#2b2d4a] to-[#3d4063] p-8 rounded shadow-lg w-full max-w-lg space-y-4">
				{/* Logos */}
				<div className="flex flex-col items-center justify-center gap-y-3">
					<img src={map} alt="map" className="h-16" />
					<img src={logo} alt="logo" className="h-9 mt-2" />
					<img src={title} alt="title" className="h-10 -mt-4" />
				</div>
				<br />

				{successMessage && (
					<p className="text-green-400 text-xs">{successMessage}</p>
				)}

				{modeLogin ? (
					<LoginForm />
				) : (
					<SignUpForm onSuccess={handleSuccess} />
				)}

				<p className="text-sm text-center mt-2">
					{modeLogin
						? "Already have an account? "
						: "Don’t have an account? "}
					<span
						onClick={() => setModeLogin(!modeLogin)}
						className="text-blue-400 cursor-pointer underline"
					>
						{modeLogin ? "Sign Up" : "Login"}
					</span>
				</p>
			</div>
		</div>
	);
}
