import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' ✅MongoDB Conneted');

    } catch (error) {
        console.log(`❌connection error : ${error}`);
        process.exit(1)

    }
}
export default connectDB;