import { useEffect, useState } from "react";
import PlaceList from "../components/PlacesList";
import MapView from "../components/MapView";
import FilterBar from "../components/FiltersBar";
import { getDistanceInKm } from "../utils/distance";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

export default function MapPage() {
	const [places, setPlaces] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filtered, setFiltered] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedDistance, setSelectedDistance] = useState("");
	const [userLocation, setUserLocation] = useState(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
	const [showReviewedOnly, setShowReviewedOnly] = useState(false);
	const [searchParams] = useSearchParams();

	const { user } = useAuth();

	useEffect(() => {
		api.get("/places")
			.then((res) => {
				setPlaces(res.data);
				setFiltered(res.data);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const reviewedParam = searchParams.get("reviewed");
		const likedParam = searchParams.get("liked");
		if (reviewedParam === "true") {
			setShowReviewedOnly(true);
		}
		if (likedParam === "true") {
			setShowFavoritesOnly(true);
		}
	}, [searchParams]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setUserLocation({
					lat: pos.coords.latitude,
					lon: pos.coords.longitude,
				});
			},
			(err) => {
				console.warn("Could not get location", err);
				setUserLocation(null);
			}
		);
	}, []);

	useEffect(() => {
		const result = places.filter((p) => {
			const matchesSearch = p.name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategories.length === 0 ||
				selectedCategories.includes(p.category);
			const matchesDistance =
				!selectedDistance ||
				!userLocation ||
				getDistanceInKm(
					p.lat,
					p.lon,
					userLocation.lat,
					userLocation.lon
				) <= Number(selectedDistance);

			const matchesFavorites =
				!showFavoritesOnly || user?.favorites?.includes(p._id);
			const matchesReviewed =
				!showReviewedOnly ||
				p.reviews?.some((r) => r.user === user?._id);

			return (
				matchesSearch &&
				matchesCategory &&
				matchesDistance &&
				matchesFavorites &&
				matchesReviewed
			);
		});

		setFiltered(result);
	}, [
		searchQuery,
		selectedCategories,
		selectedDistance,
		userLocation,
		places,
		showFavoritesOnly,
		showReviewedOnly,
		user,
	]);

	const handleCategoryChange = (items) => {
		setSelectedCategories(items);
	};

	const handleClearFilters = () => {
		setSearchQuery("");
		setSelectedCategories([]);
		setSelectedDistance("");
		setFiltered(places);
		setShowFavoritesOnly(false);
		setShowReviewedOnly(false);
	};

	return (
		<div className="h-screen flex flex-col bg-[#1c1d33] relative">
			<FilterBar
				isAuthenticated={!!user}
				hasLocation={!!userLocation}
				selectedDistance={selectedDistance}
				onSearchChange={(e) => setSearchQuery(e.target.value)}
				onCategoryChange={handleCategoryChange}
				onDistanceChange={(e) => setSelectedDistance(e.target.value)}
				selected={selectedCategories}
				onClearFilters={handleClearFilters}
				showFavoritesOnly={showFavoritesOnly}
				setShowFavoritesOnly={setShowFavoritesOnly}
				showReviewedOnly={showReviewedOnly}
				setShowReviewedOnly={setShowReviewedOnly}
			/>

			<button
				onClick={() => setIsSidebarOpen(true)}
				className="md:hidden text-white text-sm absolute bottom-[15px] left-4 z-40 bg-[#2b2e45] px-3 py-2 rounded-md shadow-lg"
			>
				☰ Categories
			</button>

			{isSidebarOpen && (
				<div
					onClick={() => setIsSidebarOpen(false)}
					className="fixed inset-0 bg-black/50 z-40 md:hidden"
				/>
			)}

			<div className="flex flex-1 h-full max-h-[calc(100vh-150px)]">
				<PlaceList
					loading={loading}
					places={filtered}
					selectedPlace={selectedPlace}
					onSelectPlace={setSelectedPlace}
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				/>
				<MapView places={filtered} selectedPlace={selectedPlace} />
			</div>
		</div>
	);
}
