import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();
/* This piece of code will allow express to identify that these routes will all be configured and it allow us to have these in separate files to keep us organized*/
//instead of doing app.use we do
router.post("/login", login);

export default router;