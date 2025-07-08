import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function MyReviews({ onSelectPlace }) {
	const { user } = useAuth();
	const [places, setPlaces] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:4000/api/places").then((res) => {
			setPlaces(res.data);
		});
	}, []);

	// Get user's own reviews from places
	const reviews =
		places?.flatMap((place) =>
			(place.reviews || [])
				.filter((r) => {
					const reviewUserId =
						typeof r.user === "object" ? r.user._id : r.user;
					return reviewUserId?.toString() === user._id.toString();
				})
				.map((r) => ({ ...r, place }))
		) || [];

	const renderStars = (rating) => (
		<div className="flex gap-1 text-yellow-400">
			{[...Array(5)].map((_, i) =>
				i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
			)}
		</div>
	);

	return (
		<div className="w-full mx-auto p-6 py-8  rounded-xl  text-white space-y-4">
			<h2 className="text-xl text-center font-semibold mb-4 text-white  mx-auto">
				My Reviews & Ratings
			</h2>
			<br />
			{reviews.length === 0 ? (
				<p className="text-center text-gray-400 italic">
					You haven’t posted any reviews yet.
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[calc(80vh-100px)] overflow-y-auto pr-2">
					{reviews
						.filter((r, i) => i < 6)
						.map((r, i) => (
							<div
								key={i}
								onClick={() => onSelectPlace?.(r.place)}
								className="border p-4 space-y-2 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition"
							>
								<div className="flex justify-between items-center">
									<h3 className="font-medium text-base">
										{r.place.name}
									</h3>
									<span className="text-xs text-gray-400">
										{r.place.category}
									</span>
								</div>
								{r.place.address && (
									<p className="text-sm text-gray-300 italic">
										{r.place.address}
									</p>
								)}
								<div>{renderStars(r.rating)}</div>
								<p className="text-sm">{r.comment}</p>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
