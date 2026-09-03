import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import { clientOrigins } from "./config/clientUrl.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: clientOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user/", userRouter);











export default app