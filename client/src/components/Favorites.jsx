import { useEffect, useState } from "react";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api"; // ✅ use central axios instance

export default function Favorites({ onSelectPlace }) {
	const { user, updateUser } = useAuth();
	const [places, setPlaces] = useState([]);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		if (!user) return;

		api.get("/places")
			.then((res) => setPlaces(res.data))
			.catch((err) => console.error("Failed to fetch places:", err));
	}, [user]);

	const favoritePlaces = places.filter((place) =>
		user?.favorites?.includes(place._id)
	);

	const renderStars = (rating) => (
		<div className="flex gap-1 text-yellow-400 text-sm">
			{[...Array(5)].map((_, i) =>
				i < Math.round(rating) ? (
					<FaStar key={i} />
				) : (
					<FaRegStar key={i} />
				)
			)}
		</div>
	);

	const toggleFavorite = async (placeId) => {
		if (updating) return;
		setUpdating(true);

		try {
			const res = await api.post(`/auth/${placeId}/favorite`);
			if (res.status === 200) {
				const isFav = user.favorites.includes(placeId);
				const newFavorites = isFav
					? user.favorites.filter((id) => id !== placeId)
					: [...user.favorites, placeId];

				updateUser({ favorites: newFavorites });
			}
		} catch (e) {
			console.error("Error updating favorite:", e);
		} finally {
			setUpdating(false);
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto p-6 py-8 rounded-xl text-white">
			<h2 className="text-xl font-semibold mb-6 text-center">
				My Favorite Places
			</h2>

			{favoritePlaces.length === 0 ? (
				<p className="text-center text-gray-400 italic">
					You haven't marked any favorites yet.
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
					{favoritePlaces.map((place) => (
						<div
							key={place._id}
							className="border p-4 rounded bg-white/5 hover:bg-white/10 transition cursor-pointer relative"
							onClick={() => onSelectPlace?.(place)}
						>
							<button
								onClick={(e) => {
									e.stopPropagation();
									toggleFavorite(place._id);
								}}
								className="absolute top-2 right-2 text-red-500 hover:scale-110 transition"
								title="Remove from favorites"
							>
								<FaHeart />
							</button>

							<h3 className="text-lg font-medium">
								{place.name}
							</h3>
							<p className="text-sm text-gray-400">
								{place.category}
							</p>
							{place.address && (
								<p className="text-xs italic text-gray-300 mt-1">
									{place.address}
								</p>
							)}
							<div className="mt-2">
								{renderStars(place.rating)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
