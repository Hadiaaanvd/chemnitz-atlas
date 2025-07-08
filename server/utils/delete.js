import connectDB from "./db.js"; // adjust path if needed
import Place from "../models/Place.js";

await connectDB();

await Place.deleteMany({ name: "Unnamed" });

console.log("❌ Deleted all documents with name = 'Unnamed'");
process.exit(0);
