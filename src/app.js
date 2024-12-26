import express, { json } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
//Funciones de las rutas
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(morgan("dev"));
connectDB();
app.use(express.json());

/* Uso de rutas */

app.use("/walky", authRoutes);
export default app;
