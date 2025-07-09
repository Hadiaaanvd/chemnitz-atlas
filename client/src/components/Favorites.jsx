import { useEffect, useState } from "react";
import { FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Favorites({}) {
	const navigate = useNavigate();
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
							className="border rounded-xl flex items-center justify-between p-4 rounded bg-white/5 hover:bg-white/10 transition cursor-pointer relative"
							onClick={() => navigate("/?liked=true")}
						>
							<div>
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
							<button
								onClick={(e) => {
									e.stopPropagation();
									toggleFavorite(place._id);
								}}
								title={"Unfavorite"}
								className="flex cursor-pointer h-8  mr-1 text-xs items-center gap-2 px-3 py-1.5 border rounded-md text-sm transition-all duration-200 border-pink-500 text-white bg-[#f87171] hover:bg-[#f87171]-500/60"
							>
								<FaRegHeart />
								<span>Unfavorite</span>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
