<<<<<<< HEAD
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;
=======
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
