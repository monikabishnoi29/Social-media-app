import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url"; // these two allow us to properly set the paths when we configure directories
import authRoutes from "./routes/auth.js";//we have path and routes for every type
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";

import { verifyToken } from "./middleware/auth.js";

/* CONFIGURATIONS */
const __filename =  fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Fix the variable name // this only when use type module
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());//Resources sharing policies
//set the directory // where we keep our assets in our case it'll be the images that we store so we're going to store this locally in a real live production app we would want to store it in an actual storage file directory pr a storage a cloud storage like S3 but in this case we're going to want to keep things simple
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */ 
// configurations as well
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");//anytime someone uploads file on to my website then it's going to say destination it's going to saved into this perticular folder(locally)
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

/* RoUTES WITH FILES */ 
/*if they want to register you're going to call this API from the frontend (/auth/register): rout we are going to hit*/
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// app.post("/auth/register", upload.single("picture"), verifyToken, register);


/* RoUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // Correct property name
    useUnifiedTopology: true, // Correct property name
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`)); // Fix the template string
}).catch((error) => console.log(`${error} did not connect`)); //Hint-promise state 
