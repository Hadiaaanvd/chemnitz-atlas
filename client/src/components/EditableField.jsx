// src/components/EditableField.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

export default function EditableField({
	label,
	value,
	disabled = false,
	onSave,
	placeholder = "",
	type = "text",
}) {
	const [editing, setEditing] = useState(false);
	const [input, setInput] = useState(value || "");
	const [error, setError] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	let debounceTimeout;

	const handleSave = async () => {
		if (!input.trim()) {
			setError("Field cannot be empty");
			return;
		}
		try {
			await onSave(input);
			setEditing(false);
			setError("");
			setSuccess("Successfully updated");

			setTimeout(() => setSuccess(""), 2000); // clear after 2s
		} catch (err) {
			setError("Update failed");
		}
	};

	useEffect(() => {
		if (label !== "Location") return;

		if (input.trim().length < 1) {
			setSuggestions([]);
			return;
		}

		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			setLoading(true);
			axios
				.get("https://nominatim.openstreetmap.org/search", {
					params: {
						q: input,
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
	}, [input]);

	return (
		<div className="mb-4 mx-auto w-full max-w-lg">
			<p className="text-xs text-gray-300 mb-1">{label}</p>
			{editing ? (
				<div className="flex items-center gap-2">
					<div className="relative w-full">
						<input
							type={type}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder={placeholder}
							className="px-3 py-3 rounded bg-white text-black text-xs w-full outline-none focus:ring-2 focus:ring-blue-400"
						/>
						{label === "Location" && suggestions.length > 0 && (
							<ul className="absolute z-10 bg-white text-black rounded shadow w-full mt-1 max-h-40 overflow-y-auto text-xs">
								{loading && (
									<li className="p-2 text-gray-400">
										Searching...
									</li>
								)}
								{suggestions.map((s) => (
									<li
										key={s.place_id}
										onClick={() => {
											setInput(s.display_name);
											setSuggestions([]);
										}}
										className="px-4 py-2 cursor-pointer hover:bg-gray-200"
									>
										{s.display_name}
									</li>
								))}
							</ul>
						)}
					</div>
					<button onClick={handleSave}>
						<FiCheck className="text-green-500 cursor-pointer" />
					</button>
					<button onClick={() => setEditing(false)}>
						<FiX className="text-red-400 cursor-pointer" />
					</button>
				</div>
			) : (
				<div className="flex items-center justify-between bg-gradient-to-r from-[#54577c] to-[#2f324f] px-3 py-3 rounded">
					<span className="text-white text-xs">{value}</span>
					{!disabled && (
						<button onClick={() => setEditing(true)}>
							<FiEdit2 className="text-gray-400 hover:text-white cursor-pointer" />
						</button>
					)}
				</div>
			)}
			{error && <p className="text-red-400 text-sm mt-1">{error}</p>}
			{success && (
				<p className="text-green-400 text-xs mt-1">
					{label} {success}
				</p>
			)}
		</div>
	);
}
