import { useState } from "react";
import {
	FaUserEdit,
	FaKey,
	FaStar,
	FaHeart,
	FaUserCircle,
} from "react-icons/fa";
import EditGeneralInfo from "../components/EditProfile";
import EditPassword from "../components/ChangePassword";
import MyReviews from "../components/PersonalReviews";
import Favorites from "../components/Favorites";
import logo from "../assets/logo-sub.svg";

const mainTabs = {
	"Edit Profile": [
		{ key: "Edit General Info", icon: <FaUserEdit /> },
		{ key: "Edit Password", icon: <FaKey /> },
	],
	"My Reviews": [],
	Favorites: [],
};

const tabIcons = {
	"Edit Profile": <FaUserCircle />,
	"My Reviews": <FaStar />,
	Favorites: <FaHeart />,
};

const borderColors = {
	"Edit Profile": "border-blue-400",
	"My Reviews": "border-yellow-400",
	Favorites: "border-pink-400",
};

export default function ProfilePage() {
	const [mainTab, setMainTab] = useState("Edit Profile");
	const [subTab, setSubTab] = useState("Edit General Info");

	const renderSection = () => {
		if (mainTab === "Edit Profile") {
			return subTab === "Edit Password" ? (
				<EditPassword />
			) : (
				<EditGeneralInfo />
			);
		} else if (mainTab === "My Reviews") {
			return <MyReviews />;
		} else if (mainTab === "Favorites") {
			return <Favorites />;
		}
	};

	return (
		<div className="flex h-[calc(100vh-100px)] bg-[#1c1e2e] text-white">
			{/* Sidebar */}

			<aside className="w-110 p-4 space-y-4 overflow-y-auto">
				<br />
				{Object.entries(mainTabs).map(([tab, subTabs]) => (
					<div
						key={tab}
						className={`rounded-xl border-l-4 p-4 bg-[#1e213a] shadow-md ${
							borderColors[tab] || "border-blue-400"
						}`}
					>
						{/* Main tab title click → switch to mainTab + default subTab */}
						<button
							onClick={() => {
								setMainTab(tab);
								if (subTabs.length > 0) {
									setSubTab(subTabs[0].key);
								}
							}}
							className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide mb-2 cursor-pointer w-full text-left"
						>
							<span>{tabIcons[tab]}</span>
							<span>{tab}</span>
						</button>

						{/* Sub-tabs visible only if they exist */}
						{subTabs && subTabs.length > 0 && (
							<div className="mt-2 space-y-2">
								{subTabs.map((sub) => (
									<button
										key={sub.key}
										onClick={() => {
											setMainTab(tab);
											setSubTab(sub.key);
										}}
										className={`cursor-pointer flex items-center gap-2 px-4 py-3 w-full text-left text-sm rounded-lg transition-all ${
											subTab === sub.key &&
											mainTab === tab
												? "bg-[#2f334d] font-medium"
												: "bg-gradient-to-r from-[#2b2d4a] to-[#3d4063] hover:scale-[1.01] hover:shadow-lg text-gray-300"
										}`}
									>
										{sub.icon}
										{sub.key}
									</button>
								))}
							</div>
						)}
					</div>
				))}
			</aside>

			<main className="flex-1 bg-[#1c1e2e] p-10 overflow-auto">
				<div className="w-full h-full p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl text-white space-y-6 border border-white/10">
					{renderSection()}
				</div>
			</main>
		</div>
	);
}
