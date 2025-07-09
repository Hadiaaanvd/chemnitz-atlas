import { useState } from "react";
import {
	FaUtensils,
	FaHotel,
	FaLandmark,
	FaTheaterMasks,
	FaPaintBrush,
	FaHome,
} from "react-icons/fa";

export default function PlaceList({
	places,
	onSelectPlace,
	isOpen,
	onClose,
	loading,
}) {
	const categories = [...new Set(places.map((p) => p.category))];
	const [expanded, setExpanded] = useState({});
	const [openCategories, setOpenCategories] = useState({});

	const toggleExpand = (cat) => {
		setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
	};

	const toggleOpen = (cat) => {
		setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
	};

	const categoryIcons = {
		restaurant: <FaUtensils />,
		guest_house: <FaHome />,
		museum: <FaLandmark />,
		theatre: <FaTheaterMasks />,
		artwork: <FaPaintBrush />,
		hotel: <FaHotel />,
	};

	const categoryColors = {
		restaurant: "#f87171",
		guest_house: "#6ee7b7",
		museum: "#60a5fa",
		theatre: "#34d399",
		artwork: "#a78bfa",
		hotel: "#fbbf24",
	};

	const getCategoryColor = (cat) =>
		categoryColors[cat.toLowerCase()] || "#93c5fd";

	return (
		<div
			className={`
        fixed top-0 left-0 h-full w-100 bg-[#1e213a] z-50 p-4 text-white overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:block md:w-1/3
      `}
		>
			{/* Close button on mobile */}
			<button
				onClick={onClose}
				className="md:hidden absolute top-4 right-4 text-white text-2xl"
			>
				×
			</button>

			{loading ? (
				<div className="bg-[#1e213a] text-center text-sm text-gray-300 rounded-xl py-10 px-4 shadow-md mt-10">
					<p className="animate-pulse">
						Please Wait! This might take a second.
					</p>
					<p className="text-xs mt-2">Loading places...</p>
				</div>
			) : places.length === 0 ? (
				<div className="bg-[#1e213a] text-center text-sm text-gray-300 rounded-xl py-10 px-4 shadow-md mt-10">
					<p>No places found.</p>
					<p className="text-xs mt-2">
						Try adjusting your filters or search.
					</p>
				</div>
			) : (
				categories.map((cat) => {
					const list = places.filter((p) => p.category === cat);
					const isExpanded = expanded[cat] ?? false;
					const isOpenCat = openCategories[cat] ?? true;
					const shownItems = isExpanded ? list : list.slice(0, 5);
					const color = getCategoryColor(cat);

					return (
						<div
							key={cat}
							className="mb-6 bg-[#1e213a] rounded-xl shadow-md border-l-4"
							style={{ borderColor: color }}
						>
							<button
								onClick={() => toggleOpen(cat)}
								className="w-full px-4 py-4 flex justify-between items-center"
							>
								<div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
									<span style={{ color }}>
										{categoryIcons[cat.toLowerCase()] ||
											null}
									</span>
									<span>{cat.replace("_", " ")}</span>
								</div>
								<span
									className="text-xs px-2 py-0.5 rounded-full font-medium"
									style={{
										backgroundColor: color,
										color: "#1e213a",
									}}
								>
									{list.length}
								</span>
							</button>

							<div
								className="transition-all duration-300 overflow-hidden"
								style={{
									maxHeight: isOpenCat
										? `${shownItems.length * 68 + 40}px`
										: "0px",
								}}
							>
								<ul className="px-4 pb-3">
									{shownItems.map((place) => (
										<li
											key={place._id}
											onClick={() => onSelectPlace(place)}
											className="cursor-pointer px-4 py-3 mb-2 bg-gradient-to-r from-[#2b2d4a] to-[#3d4063] rounded-lg hover:scale-[1.01] hover:shadow-lg transition-all"
										>
											<p className="font-medium truncate">
												{place.name}
											</p>
											{place.address && (
												<p className="text-xs text-gray-300 truncate">
													{place.address}
												</p>
											)}
										</li>
									))}

									{list.length > 5 && (
										<li className="text-right mt-1">
											<button
												onClick={() =>
													toggleExpand(cat)
												}
												className="text-sm text-blue-300 hover:underline"
											>
												{isExpanded
													? "Show less"
													: "Show more"}
											</button>
										</li>
									)}
								</ul>
							</div>
						</div>
					);
				})
			)}
		</div>
	);
}
