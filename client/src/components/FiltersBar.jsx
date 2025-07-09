import { useState, useEffect } from "react";
import logo from "../assets/logo-sub.svg";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { FiSearch } from "react-icons/fi";
import { FaHeart, FaStar, FaFilter } from "react-icons/fa";

export default function FilterBar({
	onSearchChange,
	selected,
	onCategoryChange,
	onDistanceChange,
	onClearFilters,
	selectedDistance,
	showFavoritesOnly,
	setShowFavoritesOnly,
	showReviewedOnly,
	setShowReviewedOnly,
	isAuthenticated,
	hasLocation,
}) {
	const [showMobileFilters, setShowMobileFilters] = useState(false);

	// Close filters if screen resizes to desktop
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 968) setShowMobileFilters(false);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			{/* Mobile Toggle Button */}
			<div className="md:hidden px-4 py-2 bg-[#1c1d33] border-b border-[#2b2e45]">
				<button
					onClick={() => setShowMobileFilters((prev) => !prev)}
					className="text-white text-sm bg-[#2b2e45] px-3 py-2 rounded-md w-full"
				>
					{showMobileFilters ? "Hide Filters ▲" : "Show Filters ▼"}
				</button>
			</div>

			{/* Filter Bar */}
			<div
				className={`bg-[#374151] px-6 py-3 sticky top-[64px] z-40 border-b border-[#2b2e45] ${
					showMobileFilters ? "block" : "hidden"
				} md:flex md:flex-wrap md:items-center md:justify-between md:gap-4`}
			>
				{/* Logo */}
				<img
					src={logo}
					alt="ChemnitzAtlas Logo"
					className="h-9 mb-2 md:mb-0"
				/>

				{/* Filters */}
				<div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-3 w-full md:w-auto">
					{/* Search */}
					<div className="relative w-full md:w-64">
						<input
							type="text"
							placeholder="Search places..."
							onChange={onSearchChange}
							className="w-full h-10 pl-10 pr-4 text-sm rounded-md bg-[#4b5563] text-white placeholder:text-gray-400 border border-[#2b2e45] focus:ring-2 focus:ring-[#60a5fa] outline-none"
						/>
						<span className="absolute left-3 top-2.5 text-gray-300">
							<FiSearch size={16} />
						</span>
					</div>

					{/* Show Favorites */}
					{isAuthenticated && (
						<button
							onClick={() =>
								setShowFavoritesOnly(!showFavoritesOnly)
							}
							className={`h-10 px-3 rounded-md border text-sm text-white flex items-center bg-[#4b5563] gap-2 transition ${
								showFavoritesOnly
									? "border-red-600 border-2"
									: "border-[#2b2e45]"
							}`}
							title="Show Favorites"
						>
							<FaHeart />
							Favorites
						</button>
					)}

					{/* Show Reviewed */}
					{isAuthenticated && (
						<button
							onClick={() =>
								setShowReviewedOnly(!showReviewedOnly)
							}
							className={`h-10 px-3 rounded-md border text-white bg-[#4b5563]  cursor-pointer text-sm flex items-center gap-2 transition ${
								showReviewedOnly
									? "border-yellow-500 border-2"
									: " border-[#2b2e45]"
							}`}
							title="Show Reviewed"
						>
							<FaStar />
							Reviewed
						</button>
					)}

					{/* Category */}
					<div title="Filter by Category">
						<MultiSelectDropdown
							options={[
								{ value: "museum", label: "Museum" },
								{ value: "theatre", label: "Theatre" },
								{ value: "artwork", label: "Artwork" },
								{ value: "hotel", label: "Hotel" },
								{ value: "restaurant", label: "Restaurant" },
								{ value: "guest_house", label: "Guest House" },
							]}
							selected={selected}
							onChange={onCategoryChange}
							icon={<FaFilter />}
						/>
					</div>

					{/* Distance */}
					{hasLocation && (
						<div className="flex items-center gap-1">
							<select
								value={selectedDistance}
								onChange={onDistanceChange}
								className="h-10 px-3 w-32 cursor-pointer text-sm rounded-md bg-[#4b5563] text-white border border-[#2b2e45] focus:ring-2 focus:ring-[#60a5fa] outline-none"
							>
								<option value="">Distance</option>
								<option value="1">1 km</option>
								<option value="5">5 km</option>
								<option value="10">10 km</option>
							</select>
						</div>
					)}

					{/* Clear Button */}
					<button
						onClick={onClearFilters}
						className="px-4 underline text-blue-300 cursor-pointer h-10 rounded-md text-sm hover:text-red-300 transition"
					>
						Clear Filters
					</button>
				</div>
			</div>
		</>
	);
}
