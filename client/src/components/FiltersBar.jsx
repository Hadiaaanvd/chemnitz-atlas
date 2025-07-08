import logo from "../assets/logo-sub.svg";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { FiSearch } from "react-icons/fi";

export default function FilterBar({
	onSearchChange,
	selected,
	onCategoryChange,
	onDistanceChange,
	onClearFilters,
	selectedDistance,
}) {
	return (
		<div className="bg-[#374151] px-6 py-3 sticky top-[64px] z-40 border-b border-[#2b2e45] flex flex-wrap items-center justify-between gap-4">
			{/* Logo */}
			<img src={logo} alt="ChemnitzAtlas Logo" className="h-9" />

			{/* Filters */}
			<div className="flex gap-3 flex-wrap items-center">
				{/* Search Input */}
				<div className="relative w-64">
					<input
						type="text"
						placeholder="Search places..."
						onChange={onSearchChange}
						className="w-full h-10 pl-10 pr-4 text-sm rounded-md bg-[#4b5563] text-white placeholder:text-gray-400 border border-[#2b2e45] focus:ring-2 focus:ring-[#60a5fa] outline-none"
					/>
					<span className="absolute left-3 top-3 text-gray-300">
						<FiSearch size={16} />
					</span>
				</div>

				{/* Category Dropdown */}
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
				/>

				{/* Distance Dropdown */}
				<select
					value={selectedDistance}
					onChange={onDistanceChange}
					className="h-10 px-3 w-32 text-sm rounded-md bg-[#4b5563] text-white border border-[#2b2e45] focus:ring-2 focus:ring-[#60a5fa] outline-none"
				>
					<option value="">Distance</option>
					<option value="1">1 km</option>
					<option value="5">5 km</option>
					<option value="10">10 km</option>
				</select>

				{/* Clear Button */}
				<button
					onClick={onClearFilters}
					className="px-4 cursor-pointer h-10 rounded-md bg-[#ef4444] text-white text-sm hover:bg-[#dc2626] transition"
				>
					Clear
				</button>
			</div>
		</div>
	);
}
