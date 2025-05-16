import mongoose from "mongoose";


export async function dbConnectionMain() {
  try {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI_MAIN as string);
    console.log("connected to mongoDB - Main database");
  } catch (err) {
    console.error(err);
  }
}
