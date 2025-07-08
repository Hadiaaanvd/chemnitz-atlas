import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import map from "../assets/map-logo.svg";
import logo from "../assets/logo-title.svg";

export default function Navbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated, logout, user } = useAuth();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const dropdownRef = useRef();

	const toggleDropdown = () => setDropdownOpen((prev) => !prev);
	const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<nav className="bg-[#181a28]/90 backdrop-blur-md shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50 border-b border-[#2b2e45]">
			{/* Logo */}
			<div
				className="flex items-center gap-2 cursor-pointer"
				onClick={() => navigate("/")}
			>
				<img src={map} alt="Logo" className="h-11 -ml-4" />
				<img src={logo} alt="Title" className="h-7 -ml-4" />
			</div>

			{/* Desktop Nav */}
			<div className="hidden md:flex gap-6 items-center">
				<Link
					to="/"
					className={`text-sm font-medium px-2 py-1 ${
						location.pathname === "/"
							? "text-[#60a5fa] border-b-2 border-[#60a5fa]"
							: "text-gray-300 hover:text-white"
					}`}
				>
					Explore
				</Link>

				{isAuthenticated ? (
					<div className="relative" ref={dropdownRef}>
						<div
							className="cursor-pointer ml-5"
							onClick={toggleDropdown}
						>
							<FaUserCircle
								size={28}
								className="w-7 h-7 bg-[#181a28] rounded-full flex items-center justify-center mt-1 cursor-pointer text-white"
							/>
						</div>

						{dropdownOpen && (
							<div className="absolute right-0 mt-2 bg-[#2b2e45] text-white rounded-lg shadow-lg w-48 text-sm z-50 py-2 border border-[#3d3f5e]">
								<div className="px-4 py-2 text-gray-300 border-b border-[#3d3f5e]">
									Hello,{" "}
									<span className="font-semibold">
										{user?.name}
									</span>
								</div>
								<Link
									to="/profile"
									className="px-4 py-2 hover:bg-[#3d3f5e] cursor-pointer flex items-center gap-2 transition"
								>
									<FiUser className="text-gray-400" />
									View Profile
								</Link>
								<div
									onClick={logout}
									className="px-4 py-2 hover:bg-[#3d3f5e] cursor-pointer flex items-center gap-2 transition"
								>
									<FiLogOut className="text-gray-400" />
									Logout
								</div>
							</div>
						)}
					</div>
				) : (
					<Link
						to="/login"
						className={`text-sm font-medium px-2 py-1 ${
							location.pathname === "/login"
								? "text-[#60a5fa] border-b-2 border-[#60a5fa]"
								: "text-gray-300 hover:text-white"
						}`}
					>
						Login
					</Link>
				)}
			</div>

			{/* Mobile Menu Toggle */}
			<div className="md:hidden">
				<button
					onClick={toggleMobileMenu}
					className="text-white focus:outline-none"
				>
					{mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
				</button>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="absolute top-full left-0 w-full bg-[#181a28] text-white shadow-md border-t border-[#2b2e45] md:hidden z-40">
					<div className="flex flex-col gap-2 px-6 py-4">
						<Link
							to="/"
							onClick={() => setMobileMenuOpen(false)}
							className={`text-sm font-medium ${
								location.pathname === "/"
									? "text-[#60a5fa]"
									: "text-gray-300 hover:text-white"
							}`}
						>
							Explore
						</Link>

						{isAuthenticated ? (
							<>
								<Link
									to="/profile"
									onClick={() => setMobileMenuOpen(false)}
									className="flex items-center gap-2 text-sm hover:text-white text-gray-300"
								>
									<FiUser />
									View Profile
								</Link>
								<div
									onClick={() => {
										logout();
										setMobileMenuOpen(false);
									}}
									className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer"
								>
									<FiLogOut />
									Logout
								</div>
							</>
						) : (
							<Link
								to="/login"
								onClick={() => setMobileMenuOpen(false)}
								className={`text-sm font-medium ${
									location.pathname === "/login"
										? "text-[#60a5fa]"
										: "text-gray-300 hover:text-white"
								}`}
							>
								Login
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
