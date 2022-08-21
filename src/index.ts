import 'dotenv/config';
import express, { Express } from 'express';
import bodyParser from "body-parser";
import photoRouter from "./routes/photo";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";

// Express Config
const app: Express = express();

const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        createParentPath: true,
        preserveExtension: true
    })
);

app.use("/photo", photoRouter);

app.listen(port, async () => {
    // DB CONFIG
    try {
        await mongoose.connect(process.env.MONGO_URI || "");
    } catch (e) {
        console.log("ERROR: Unable to connect to mongodb");
    }

    console.log(`Server is running at http://localhost:${port}`);
});