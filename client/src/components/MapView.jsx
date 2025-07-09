import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { LocateUser } from "./UserLocation";
import { FaStar, FaRegStar } from "react-icons/fa";
import PlaceModal from "./PlacesModal";
import "leaflet/dist/leaflet.css";

// Fix for missing default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const getColoredCircleIcon = (color = "#e74c3c") =>
	new L.DivIcon({
		html: `<div style="
			background:${color};
			width:16px;
			height:16px;
			border-radius:50%;
			border:2px solid white;
			box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
		"></div>`,
		className: "",
		iconSize: [20, 20],
		iconAnchor: [10, 10],
	});

const getPulsingIcon = () =>
	new L.DivIcon({
		className: "pulsing-icon",
		iconSize: [30, 30],
		iconAnchor: [14, 13],
		html: '<div class="animate-pulse w-7 h-7 bg-blue-500 rounded-full border-4 border-blue-300"></div>',
	});

const getIconByCategory = (category, isSelected = false) => {
	if (isSelected) return getPulsingIcon();
	const colorMap = {
		restaurant: "#f87171",
		museum: "#60a5fa",
		theatre: "#34d399",
		artwork: "#a78bfa",
		guest_house: "#6ee7b7",
		hotel: "#fbbf24",
	};
	return getColoredCircleIcon(colorMap[category?.toLowerCase()] || "#3498db");
};

function FlyToPlace({ place }) {
	const map = useMap();
	useEffect(() => {
		if (place) {
			map.flyTo([place.lat, place.lon], 16, {
				animate: true,
				duration: 1.5,
			});
		}
	}, [place]);
	return null;
}

const renderStars = (rating) => {
	return (
		<div className="flex gap-1 text-yellow-400">
			{[...Array(5)].map((_, i) =>
				i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
			)}
		</div>
	);
};

function PlaceMarker({ place, isSelected, onClick }) {
	const markerRef = useRef();
	const icon = getIconByCategory(place.category, isSelected);

	useEffect(() => {
		if (isSelected && markerRef.current) {
			markerRef.current.openPopup();
		}
	}, [isSelected]);

	return (
		<Marker
			ref={markerRef}
			icon={icon}
			position={[place.lat, place.lon]}
			aria-label={place.name}
		>
			<Popup>
				<div
					className="space-y-2 text-black max-w-[200px] cursor-pointer"
					onClick={() => onClick(place)}
				>
					<h2 className="font-bold text-base">
						{place.name}
						<div className="text-sm font-normal text-gray-500 capitalize">
							{place.category}
						</div>
					</h2>
					<div className="text-xs -mt-1 text-gray-500 capitalize">
						{place.address}
					</div>
					{place.rating && renderStars(place.rating)}
					<button
						className="mt-1 text-xs text-blue-600 underline cursor-pointer"
						onClick={() => onClick(place)}
					>
						See More
					</button>
				</div>
			</Popup>
		</Marker>
	);
}

export default function MapView({ places, selectedPlace }) {
	const [modalPlace, setModalPlace] = useState(null);
	const mapKey = selectedPlace?._id || "default";

	return (
		<>
			<MapContainer
				center={[50.83, 12.92]}
				zoom={10}
				className="h-full w-full z-0"
				scrollWheelZoom={true}
				doubleClickZoom={true}
				touchZoom={true}
				zoomControl={true}
				dragging={true}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; OpenStreetMap contributors"
				/>

				{places.map((place) => (
					<PlaceMarker
						key={place._id}
						place={place}
						isSelected={selectedPlace?._id === place._id}
						onClick={setModalPlace}
					/>
				))}

				<FlyToPlace place={selectedPlace} />
				<LocateUser />
			</MapContainer>

			{modalPlace && (
				<PlaceModal
					place={modalPlace}
					onClose={() => setModalPlace(null)}
				/>
			)}
		</>
	);
}
