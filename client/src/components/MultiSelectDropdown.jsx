import { useEffect, useRef, useState } from "react";
import {
	FaUtensils,
	FaHotel,
	FaLandmark,
	FaTheaterMasks,
	FaPaintBrush,
	FaHome,
} from "react-icons/fa";
import { categoryColors } from "../utils/colors";

const categoryIcons = {
	restaurant: <FaUtensils />,
	guest_house: <FaHome />,
	museum: <FaLandmark />,
	theatre: <FaTheaterMasks />,
	artwork: <FaPaintBrush />,
	hotel: <FaHotel />,
};
export default function MultiSelectDropdown({ options, selected, onChange }) {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const toggleOption = (value) => {
		if (selected.includes(value)) {
			onChange(selected.filter((v) => v !== value));
		} else {
			onChange([...selected, value]);
		}
	};

	return (
		<div className="relative overflow-visible" ref={dropdownRef}>
			<button
				onClick={() => setOpen((prev) => !prev)}
				className={`h-10 px-4 text-white text-sm rounded-md border cursor-pointer 
		bg-[#4b5563] 
		${selected.length > 0 ? "border-[#60a5fa] border-2" : "border-[#2b2e45]"} 
		hover:border-[#60a5fa]`}
			>
				{selected.length > 0 ? (
					<>
						<span>Selected Category </span>
						{selected.length > 0 && (
							<span className="text-xs text-[#60a5fa] font-medium">
								({selected.length})
							</span>
						)}
					</>
				) : (
					"Select Categories"
				)}
			</button>

			{open && (
				<div className="absolute top-full left-0 mt-2 bg-[#1e213a] p-1 text-white text-sm rounded-md shadow-lg border border-[#2b2e45] w-52 max-h-60 overflow-y-auto z-120">
					{options.map((opt) => {
						const isSelected = selected.includes(opt.value);
						const color = categoryColors[opt.value] || "#60a5fa";

						return (
							<div
								key={opt.value}
								onClick={() => toggleOption(opt.value)}
								className={`px-4 py-2 cursor-pointer flex items-center gap-2 rounded-md transition hover:bg-[#2d314f]`}
								style={{
									color: isSelected ? color : "#ffffff",
								}}
							>
								<span className="flex items-center gap-2">
									{categoryIcons[opt.value]}
									{opt.label}
								</span>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
