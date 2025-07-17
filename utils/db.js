import mongoose from "mongoose";

const connectDB = async () => {
	try {
		console.log("Attempting to Connect DB");
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("DB connected Successfully");
	} catch (err) {
		console.log("Error Connecting DB: ", err);
		process.exit(1);
	}
};

export default connectDB;
