import { useEffect, useRef, useState } from "react";

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
				className="h-10 px-4 bg-[#4b5563] text-white text-sm rounded-md border border-[#2b2e45] hover:border-[#60a5fa] cursor-pointer"
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
				<div className="absolute top-full left-0 mt-2 bg-[#1c1d33] text-white text-sm rounded-md shadow-lg border border-[#2b2e45] w-52 max-h-60 overflow-y-auto z-120">
					{options.map((opt) => (
						<div
							key={opt.value}
							onClick={() => toggleOption(opt.value)}
							className={`px-4 py-2 cursor-pointer hover:bg-[#2d314f] flex items-center gap-2 ${
								selected.includes(opt.value)
									? "text-[#60a5fa] font-medium"
									: ""
							}`}
						>
							<input
								type="checkbox"
								checked={selected.includes(opt.value)}
								readOnly
								className="accent-[#60a5fa]"
							/>
							{opt.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
