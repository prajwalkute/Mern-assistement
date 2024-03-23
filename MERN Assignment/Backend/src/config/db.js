import mongoose from "mongoose";

const connectDatabase = async () => {
  mongoose.set("strictQuery", false);
  try {
    const uri = process.env.MONGO_URL;

    const res = await mongoose.connect(uri);
    if (res) {
      console.log("Database connected successfully...");
    }
    else {
      console.log("Database connection failed...");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectDatabase;
