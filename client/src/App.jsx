import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import MapPage from "./pages/MapPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="h-screen flex items-center justify-center bg-[#1c1d33] text-white">
				<p className="text-sm text-gray-400">Loading...</p>
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col bg-[#1c1d33]">
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<MapPage />} />

					{!isAuthenticated ? (
						<Route path="/login" element={<AuthPage />} />
					) : (
						<>
							<Route
								path="/login"
								element={<Navigate to="/" />}
							/>
							<Route path="/profile" element={<ProfilePage />} />
						</>
					)}

					{/* Redirect unknown routes */}
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Router>
		</div>
	);
}
