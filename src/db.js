import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("DB: CONECTADA!");
  } catch (error) {
    console.error("DB: ERROR!", error);
  }
};

export default connectDB;
