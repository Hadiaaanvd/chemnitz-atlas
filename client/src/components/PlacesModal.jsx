import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const renderStars = (rating) => (
	<div className="flex gap-0.5 text-yellow-400 text-sm">
		{[...Array(5)].map((_, i) =>
			i < Math.round(rating) ? <FaStar key={i} /> : <FaRegStar key={i} />
		)}
	</div>
);

const formatTimeAgo = (timestamp) => {
	const now = new Date();
	const posted = new Date(timestamp);
	const diff = now - posted;
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
	if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	return "Just now";
};

export default function PlaceModal({ place: initialPlace, onClose }) {
	const { user, token, updateUser } = useAuth();
	const [place, setPlace] = useState(initialPlace);
	const [comment, setComment] = useState("");
	const [rating, setRating] = useState(0);
	const [submitting, setSubmitting] = useState(false);
	const [favorite, setFavorite] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [favMessage, setFavMessage] = useState("");
	const [userReviewExists, setUserReviewExists] = useState(false);

	useEffect(() => {
		if (user && place?._id) {
			setFavorite(user.favorites?.includes(place._id));
		}
	}, [user, place]);

	useEffect(() => {
		if (user && place?.reviews?.length) {
			const existing = place.reviews.find(
				(r) => r.user === user._id || r.user?._id === user._id
			);
			if (existing) {
				setUserReviewExists(true);
				setComment(existing.comment);
				setRating(existing.rating);
			}
		}
	}, [user, place]);
	console.log(user);
	const submitReview = async () => {
		if (!comment || !rating || !place._id) return;
		setSubmitting(true);
		try {
			console.log("Submitting review with username:", user.name);
			const res = await api.post(`/places/${place._id}/reviews`, {
				comment,
				rating,
				username: user.name || "Anonymous",
			});
			setPlace(res.data.place);
			setSuccessMessage(
				userReviewExists ? "Review updated!" : "Review submitted!"
			);
			setTimeout(() => setSuccessMessage(""), 2000);
		} catch (err) {
			console.error("Review submission failed", err);
		} finally {
			setSubmitting(false);
		}
	};

	const toggleFavorite = async () => {
		try {
			const res = await api.post(`/auth/${place._id}/favorite`);
			if (res.status === 200) {
				const updatedFavorites = favorite
					? user.favorites.filter((id) => id !== place._id)
					: [...user.favorites, place._id];
				updateUser({ ...user, favorites: updatedFavorites });
				setFavorite(!favorite);
				setFavMessage(
					favorite ? "Removed from favorites" : "Added to favorites"
				);
				setTimeout(() => setFavMessage(""), 2000);
			}
		} catch (err) {
			console.error("Failed to toggle favorite:", err);
		}
	};

	if (!place) return null;

	return (
		<div className="w-full max-w-xl p-4 px-6 space-y-4 bg-[#181c2f] text-white shadow-lg rounded-xl">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div
					className="flex  items-center gap-2 text-lg  w-full font-normal
				"
				>
					<span>{place.name}</span> &nbsp;
				</div>
				<button
					onClick={onClose}
					className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-gray-400 hover:bg-gray-700 hover:text-white transition"
				>
					✕
				</button>
			</div>

			{/* Place Info */}
			<div
				className="bg-[#20243a] flex justify-between p-4 rounded-xl border-r-4"
				style={{ borderColor: "#f87171" }}
			>
				<div>
					<p className="text-sm text-gray-400 capitalize">
						{place.category}
					</p>
					{place.address && (
						<p className="text-sm">{place.address}</p>
					)}
					{place.website && (
						<a
							href={place.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-blue-400 underline"
						>
							Visit website
						</a>
					)}
					{place.description && (
						<p className="text-sm italic text-gray-300">
							{place.description}
						</p>
					)}
					<div className="mt-2">{renderStars(place.rating)}</div>
				</div>
				{user && (
					<button
						onClick={toggleFavorite}
						title={favorite ? "Unfavorite" : "Favorite"}
						className={`flex cursor-pointer h-full mt-2 mr-2 text-xs items-center gap-2 px-3 py-1.5 border rounded-md text-sm transition-all duration-200
			${
				favorite
					? "border-pink-500 text-white bg-[#f87171] hover:bg-[#f87171]-500/60"
					: "border-gray-500 text-gray-100 hover:bg-gray-500/10"
			}`}
					>
						{favorite ? <FaRegHeart /> : <FaRegHeart />}
						<span>{favorite ? "Unfavorite" : "Favorite"}</span>
					</button>
				)}
			</div>

			{favMessage && (
				<p className="text-green-400 text-xs -mt-3">{favMessage}</p>
			)}

			{/* Reviews */}
			<div
				className="bg-[#20243a] p-4 rounded-xl border-r-4"
				style={{ borderColor: "#34d399" }}
			>
				<h3 className="text-base font-semibold mb-2">Reviews</h3>
				<ul className="space-y-3 max-h-52 overflow-y-auto pr-1">
					{place.reviews?.length > 0 ? (
						place.reviews.map((r, i) => (
							<li
								key={i}
								className="bg-[#2a2f4a] rounded-lg p-3 text-sm"
							>
								<div className="flex justify-between mb-1">
									<span className="font-medium">
										{r.userName || "Anonymous"}
									</span>
									<span className="text-gray-400 text-xs">
										{formatTimeAgo(r.createdAt)}
									</span>
								</div>
								<div className="flex justify-between">
									<p>{r.comment}</p>
									{renderStars(r.rating)}
								</div>
							</li>
						))
					) : (
						<li className="text-gray-400 italic">No reviews yet</li>
					)}
				</ul>
			</div>

			{/* Submit Review */}
			{user && (
				<div
					className="bg-[#20243a] mt-6 p-4 rounded-xl border-r-4"
					style={{ borderColor: "#60a5fa" }}
				>
					<h3 className="text-sm font-medium mb-2">
						{userReviewExists
							? "Update Your Review"
							: "Add Your Review"}
					</h3>
					<div className="flex gap-1 text-yellow-400 text-xl mb-2">
						{[1, 2, 3, 4, 5].map((num) => (
							<button
								key={num}
								onClick={() => setRating(num)}
								className="cursor-pointer"
							>
								{rating >= num ? <FaStar /> : <FaRegStar />}
							</button>
						))}
					</div>
					<textarea
						className="w-full px-4 py-3 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-[#2a2f4a] text-white placeholder:text-gray-400"
						rows={3}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Write your thoughts..."
					/>
					{successMessage && (
						<p className="text-green-400 text-sm mt-1">
							{successMessage}
						</p>
					)}
					<div className="flex justify-end my-2">
						<button
							disabled={submitting || !rating || !comment}
							onClick={submitReview}
							className={`mt-2 px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
								submitting || !rating || !comment
									? "bg-blue-400 cursor-not-allowed"
									: "bg-blue-500 hover:bg-blue-400"
							} text-white`}
						>
							{submitting
								? "Submitting..."
								: userReviewExists
								? "Update Review"
								: "Submit Review"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
