import dotenv from "dotenv";
dotenv.config();
import express from "express";


const app = express();



async function main() {
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URL);
    await Test.create({ name: "Hello" }); // This will create the database and collection
    app.listen(3000, () => { console.log("Your app is running"); });
}

main();