import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Scheme from "../models/Scheme.js";
import schemes from "./schemesData.js";

dotenv.config();

const importData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Delete old data
    await Scheme.deleteMany();

    // Insert all schemes
    await Scheme.insertMany(schemes);

    console.log("✅ Schemes Imported Successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();