import { useEffect, useState } from "react";
import axios from "axios";
import PlaceList from "../components/PlacesList";
import MapView from "../components/MapView";
import FilterBar from "../components/FiltersBar";
import { getDistanceInKm } from "../utils/distance";

export default function MapPage() {
	const [places, setPlaces] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedDistance, setSelectedDistance] = useState("");
	const [userLocation, setUserLocation] = useState(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 👈 mobile sidebar control

	useEffect(() => {
		axios.get("http://localhost:4000/api/places").then((res) => {
			setPlaces(res.data);
			setFiltered(res.data);
		});
	}, []);

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
			return matchesSearch && matchesCategory && matchesDistance;
		});
		setFiltered(result);
	}, [
		searchQuery,
		selectedCategories,
		selectedDistance,
		userLocation,
		places,
	]);

	const handleCategoryChange = (items) => {
		setSelectedCategories(items);
	};

	const handleClearFilters = () => {
		setSearchQuery("");
		setSelectedCategories([]);
		setSelectedDistance("");
		setFiltered(places);
	};

	return (
		<div className="h-screen flex flex-col bg-[#1c1d33] relative">
			<FilterBar
				selectedDistance={selectedDistance}
				onSearchChange={(e) => setSearchQuery(e.target.value)}
				onCategoryChange={handleCategoryChange}
				onDistanceChange={(e) => setSelectedDistance(e.target.value)}
				selected={selectedCategories}
				onClearFilters={handleClearFilters}
			/>

			{/* Mobile sidebar toggle button */}
			<button
				onClick={() => setIsSidebarOpen(true)}
				className="md:hidden text-white text-sm absolute bottom-[15px] left-4 z-40 bg-[#2b2e45] px-3 py-2 rounded-md shadow-lg"
			>
				☰ Categories
			</button>

			{/* Mobile backdrop */}
			{isSidebarOpen && (
				<div
					onClick={() => setIsSidebarOpen(false)}
					className="fixed inset-0 bg-black/50 z-40 md:hidden"
				/>
			)}

			<div className="flex flex-1 h-full max-h-[calc(100vh-150px)]">
				<PlaceList
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
