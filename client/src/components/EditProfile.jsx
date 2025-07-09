import EditableField from "./EditableField";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import api from "../utils/api";

export default function EditProfile() {
	const { user, updateUser, deleteAccount } = useAuth();

	const handleFieldUpdate = async (key, value) => {
		try {
			const res = await api.put("/auth/update", { [key]: value });
			updateUser({ ...user, [key]: value }); // ⬅️ update state
		} catch (err) {
			console.error("Failed to update field:", err);
		}
	};

	return (
		<div className="w-full h-full p-6  rounded-xl shadow text-white space-y-4">
			<div className="flex flex-col items-center mb-6">
				<FaUserCircle className="text-5xl text-white mb-2" />
				<h2 className="text-lg font-semibold">Edit Profile</h2>
				<div className="text-sm text-gray-400">
					Update your profile information
				</div>
			</div>
			<EditableField
				label="Email"
				disabled={true}
				value={user?.email || ""}
			/>

			<EditableField
				label="Username"
				value={user?.name || ""}
				onSave={(val) => handleFieldUpdate("name", val)}
			/>

			<EditableField
				label="Location"
				value={user?.location || "Not set"}
				onSave={(val) => handleFieldUpdate("location", val)}
			/>
			<div className="pt-4 mt-10 border-t max-w-md  text-right mx-auto border-white/10">
				<button
					onClick={deleteAccount}
					className="cursor-pointer w-full text-right text-sm text-red-400 hover:text-red-500 underline"
				>
					Delete my account
				</button>
			</div>
		</div>
	);
}
