import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export function LocateUser() {
	const map = useMap();
	const [marker, setMarker] = useState(null);
	const [circle, setCircle] = useState(null);

	// Core logic to locate and render marker + circle
	const locateAndMark = () => {
		map.locate({
			setView: true,
			maxZoom: 14,
		});

		map.once("locationfound", (event) => {
			const { latlng, accuracy } = event;

			// Clear previous layers
			if (marker) map.removeLayer(marker);
			if (circle) map.removeLayer(circle);

			// New marker
			const newMarker = L.marker(latlng)
				.addTo(map)
				.bindPopup("You are here")
				.openPopup();
			setMarker(newMarker);

			// New circle
			const newCircle = L.circle(latlng, {
				radius: accuracy,
				color: "#3388ff",
				fillColor: "#3388ff",
				fillOpacity: 0.2,
			}).addTo(map);
			setCircle(newCircle);
		});

		map.once("locationerror", (err) => {
			console.warn("Location error:", err.message);
		});
	};

	// Run once on component mount (auto-locate)
	useEffect(() => {
		locateAndMark();
	}, []);

	const handleLocation = (e) => {
		e.preventDefault();
		e.stopPropagation();
		locateAndMark();
	};

	return (
		<button
			onClick={handleLocation}
			className="absolute bottom-4 right-4 z-[500] cursor-pointer bg-[#2b2e45] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#3a3f5a] text-sm"
		>
			📍 Locate Me
		</button>
	);
}
